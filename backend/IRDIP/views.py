import os
import json
import uuid
import pytz
import base64

from django.contrib.auth.models import User
from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.http import JsonResponse
from .models import UserRole, UploadRecord, FileUpload, Company, Road
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.conf import settings
from django.db.models import Sum, Count
from django.core.files.base import ContentFile
from django.core.exceptions import ObjectDoesNotExist

from PDC_predict.predict import predict

# 定义映射字典
classification_mapping = {
    "cementation_fissures": 0,
    "crack": 1,
    "longitudinal_crack": 2,
    "loose": 3,
    "massive_crack": 4,
    "mending": 5,
    "normal": 6,
    "transverse_crack": 7
}


def index(request):
    return render(request)


def login(request):
    if request.method == 'POST':
        company_id = request.POST.get('company_id')
        employee_number = request.POST.get('employee_number')
        password = request.POST.get('password')

        print(company_id, employee_number, password)

        try:
            user_role = UserRole.objects.get(employee_number=employee_number, company_id=company_id)
            user = authenticate(username=user_role.user.username, password=password)
            if user is not None:
                auth_login(request, user)

                return JsonResponse({"status": "success"}, status=200)
            else:
                # 认证失败
                return JsonResponse({"status": "error", "message": "Invalid credentials"}, status=401)
        except UserRole.DoesNotExist:
            return JsonResponse({"status": "error", "message": "User not found"}, status=444)
    else:
        # 非 POST 请求
        return JsonResponse({"status": "error", "message": "Invalid request"}, status=400)


def logout(request):
    if request.method == 'POST':
        # 终止当前会话
        auth_logout(request)
        return JsonResponse({"status": "success"})
    else:
        # 非 POST 请求
        return JsonResponse({"status": "error", "message": "Invalid request"}, status=400)


def register_subordinate(request):
    if request.method == 'POST':
        current_user = request.user
        current_user_role = UserRole.objects.get(user=current_user)

        # 检查当前用户的级别
        if current_user_role.user_level >= 2:
            return JsonResponse({'status': 'error', 'message': 'Unauthorized to register new users'}, status=403)

        # 获取注册信息
        username = request.POST.get('username')
        password = request.POST.get('password')
        employee_number = request.POST.get('employee_number')
        email = request.POST.get('email')

        # 检查工号是否在同一公司内已被使用
        if UserRole.objects.filter(company=current_user_role.company, employee_number=employee_number).exists():
            return JsonResponse({'status': 'error', 'message': 'Employee number already exists in the company'}, status=400)

        # 创建新用户
        new_user = User.objects.create_user(username, email, password)
        new_user_role = UserRole.objects.create(
            user=new_user,
            employee_number=employee_number,
            user_level=current_user_role.user_level + 1,
            company=current_user_role.company,
            supervisor=current_user_role
        )

        return JsonResponse({'status': 'success', 'message': 'User registered successfully'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)


def get_subordinates_info(request):
    # 检查用户是否已登录
    if not request.user.is_authenticated:
        return JsonResponse({'error': '未经授权的访问'}, status=401)

    try:
        user_role = UserRole.objects.get(user=request.user)
    except UserRole.DoesNotExist:
        return JsonResponse({'error': '用户角色未找到'}, status=404)

    # 检查当前用户的级别
    if user_role.user_level >= 2:
        return JsonResponse({'status': 'error', 'message': 'Unauthorized to access subordinates information'},
                            status=403)

    # 获取所有下属用户的ID
    subordinate_ids = get_subordinate_user_ids(user_role)

    # 获取下属用户的基本信息和上传记录信息
    subordinates = UserRole.objects.filter(id__in=subordinate_ids).select_related('user')

    if not subordinates:
        return JsonResponse({'error': '未找到下属用户'}, status=404)

    subordinates_info = []
    for subordinate in subordinates:
        # 检查用户是否激活（有最后登录时间）
        is_active = subordinate.user.last_login is not None

        # 获取上传记录数量和上传文件总数
        upload_stats = UploadRecord.objects.filter(uploader=subordinate).aggregate(
            upload_count=Count('id'), total_files=Sum('upload_count'))

        subordinates_info.append({
            'employee_number': subordinate.employee_number,
            'last_login': subordinate.user.last_login,
            'is_active': is_active,
            'user_level': subordinate.user_level,
            'upload_record_count': upload_stats['upload_count'] or 0,
            'total_upload_files': upload_stats['total_files'] or 0,
        })

    return JsonResponse(subordinates_info, safe=False, status=200)


@ensure_csrf_cookie
def get_company_info(request):
    # 查询所有公司
    companies = Company.objects.all()

    company_list = {str(company.company_id): company.company_name for company in companies}

    return JsonResponse(company_list)


def upload(request):
    try:
        if request.method == 'POST':
            user_role = UserRole.objects.get(user=request.user)
            user_id = user_role.id
            # 设置北京时区并获取当前时间
            tz = pytz.timezone('Asia/Shanghai')
            upload_time = timezone.now().astimezone(tz)
            folder_name = f'uploads/{user_id}/{upload_time.strftime("%Y%m%d%H%M%S")}'
            os.makedirs(folder_name, exist_ok=True)

            # 从表单数据中获取 imageInfo
            image_info = {
                'title': request.POST.get('title', ''),
                'road': request.POST.get('road', '')
            }

            upload_count = sum(len(request.FILES.getlist(field_name)) for field_name in request.FILES)

            upload_record = UploadRecord.objects.create(
                upload_time=upload_time,
                folder_url=folder_name,
                uploader_id=user_id,
                road_id=image_info['road'],
                upload_name=image_info['title'],
                upload_count=upload_count
            )

            for field_name, files in request.FILES.lists():
                for file in files:
                    original_name = file.name
                    file_name = uuid.uuid4().hex
                    extension = os.path.splitext(original_name)[1]  # 提取文件后缀
                    file_path = os.path.join(folder_name, file_name + extension)  # 使用上传的文件的原始文件名

                    handle_uploaded_file(file, file_path)

            # predictions = {}
            predictions = predict(user=user_id, time=upload_time.strftime("%Y%m%d%H%M%S"), model='swin')
            for file_name, result in predictions.items():
                classification_int = classification_mapping.get(result['class'], -1)
                FileUpload.objects.create(
                    upload=upload_record,
                    file_url=os.path.join(folder_name, file_name),
                    classification_result=classification_int,
                    confidence=result['probability']
                )

            return JsonResponse({'message': 'Upload successful'}, status=200)
    except UserRole.DoesNotExist:
        return JsonResponse({'error': 'User role not found'}, status=404)
    except OSError as e:
        return JsonResponse({'error': f'File system error: {e}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {e}'}, status=501)

    return JsonResponse({'error': 'Invalid request'}, status=400)
    # if request.method == 'POST':
    #     user_role = UserRole.objects.get(user=request.user)
    #     user_id = user_role.id
    #     # 设置北京时区并获取当前时间
    #     tz = pytz.timezone('Asia/Shanghai')
    #     upload_time = timezone.now().astimezone(tz)
    #     folder_name = f'uploads/{user_id}/{upload_time.strftime("%Y%m%d%H%M%S")}'
    #     os.makedirs(folder_name, exist_ok=True)
    #
    #     # 从表单数据中获取 imageInfo
    #     image_info = {
    #         'title': request.POST.get('title', ''),
    #         'road': request.POST.get('road', '')
    #     }
    #
    #     upload_count = sum(len(request.FILES.getlist(field_name)) for field_name in request.FILES)
    #
    #     upload_record = UploadRecord.objects.create(
    #         upload_time=upload_time,
    #         folder_url=folder_name,
    #         uploader_id=user_id,
    #         road_id=image_info['road'],
    #         upload_name=image_info['title'],
    #         upload_count=upload_count
    #     )
    #
    #     for field_name, files in request.FILES.lists():
    #         for file in files:
    #             original_name = file.name
    #             file_name = uuid.uuid4().hex
    #             extension = os.path.splitext(original_name)[1]  # 提取文件后缀
    #             file_path = os.path.join(folder_name, file_name + extension)  # 使用上传的文件的原始文件名
    #
    #             handle_uploaded_file(file, file_path)
    #
    #     # predictions = {}
    #     predictions = predict(user=user_id, time=upload_time.strftime("%Y%m%d%H%M%S"), model='swin')
    #     for file_name, result in predictions.items():
    #         classification_int = classification_mapping.get(result['class'], -1)
    #         FileUpload.objects.create(
    #             upload=upload_record,
    #             file_url=os.path.join(folder_name, file_name),
    #             classification_result=classification_int,
    #             confidence=result['probability']
    #         )
    #
    #     return JsonResponse({'message': 'Upload successful'}, status=200)


def handle_uploaded_file(f, file_name):
    with open(file_name, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)


@require_http_methods(["GET"])
def get_result(request):
    upload_ids = request.GET.getlist('upload_id')
    print(upload_ids)
    response_data = {}
    request_user = request.user

    upload_records = UploadRecord.objects.filter(upload_id__in=upload_ids).select_related('uploader', 'road')

    for upload_record in upload_records:
        uploader = upload_record.uploader.user

        # 检查是否有权访问此上传记录
        if not is_upload_accessible_by_user(uploader, request_user):
            continue

        files = FileUpload.objects.filter(upload=upload_record).select_related('upload')

        # 构建响应数据
        upload_data = {
            "uploader": upload_record.uploader.user.username,
            "road": upload_record.road.road_id,
            "road_name": upload_record.road.road_name,
            "upload_name": upload_record.upload_name,
            "upload_count": upload_record.upload_count,
            "files": [
                {
                    "file_id": file.file_id,
                    "file_name": os.path.basename(file.file_url),
                    "classification_result": file.classification_result,
                    "confidence": float(file.confidence),
                    "img": get_base64_encoded_image(file.file_url)
                }
                for file in files
            ]
        }

        response_data[str(upload_record.upload_id)] = upload_data

        # 处理不存在的 upload_id
    missing_ids = set(upload_ids) - set(str(upload.upload_id) for upload in upload_records)
    for missing_id in missing_ids:
        response_data[missing_id] = "Upload record not found"

    return JsonResponse(response_data)


def is_upload_accessible_by_user(upload_user, request_user):
    """检查上传记录是否可以被请求者访问"""
    # 如果上传者是请求者本人
    if upload_user == request_user:
        return True

    # 根据请求者的用户等级进行检查
    if request_user.userrole.user_level == 0:
        # 检查上传者的上级用户
        if upload_user.userrole.supervisor == request_user:
            return True
        # 检查上传者的上级的上级用户
        if upload_user.userrole.supervisor and upload_user.userrole.supervisor.supervisor == request_user:
            return True
    elif request_user.userrole.user_level == 1:
        # 检查上传者的上级用户
        if upload_user.userrole.supervisor == request_user:
            return True

    return False


def get_base64_encoded_image(image_path):
    """读取图片文件并转换为Base64编码的字符串"""
    full_path = os.path.join(settings.MEDIA_ROOT, image_path)
    with open(full_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')


def get_lasted_upload_id(request):
    user = request.user
    try:
        user_role = UserRole.objects.get(user=user)
        # 按照上传时间排序，获取最后一个上传的记录
        upload_record = UploadRecord.objects.filter(uploader=user_role).order_by('-upload_time').first()
        if upload_record:
            print(f"upload_id: {str(upload_record.upload_id)}")
            return JsonResponse({"upload_id": str(upload_record.upload_id)})
        else:
            return JsonResponse({"upload_id": ""})
    except UserRole.DoesNotExist:
        return JsonResponse({"error": "用户角色信息不存在"}, status=444)


def road_registration(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # 从data中获取道路和区域信息
            # 使用data.get()，确保即使这些键不存在也不会抛出异常
            region = data.get('region', {})
            roadDetails = data.get('roadDetails', {})

            # 检查数据完整性
            if not region or not roadDetails:
                return JsonResponse({'status': 'error', 'message': '数据不完整，请提供完整信息。'}, status=400)

            # 提取具体信息
            province = region.get('province')
            city = region.get('city')
            district = region.get('district')
            road_name = roadDetails.get('title')
            location = roadDetails.get('location', {})
            longitude = location.get('lng')
            latitude = location.get('lat')

            # 获取当前用户的公司
            user_role = UserRole.objects.filter(user=request.user).first()

            if not user_role:
                return JsonResponse({'status': 'error', 'message': '无法确定用户所属公司。'}, status=400)
            company = user_role.company

            # 在新增之前检查是否已存在具有相同经纬度和道路名的数据
            existing_road = Road.objects.filter(
                company=company,
                road_name=road_name,
                gps_longitude=longitude,
                gps_latitude=latitude
            ).first()

            if existing_road:
                return JsonResponse({'status': 'error', 'message': '已存在相同的道路信息。'}, status=400)

            # 创建Road实例
            road = Road(
                road_id=uuid.uuid4(),
                road_name=road_name,
                gps_longitude=longitude,
                gps_latitude=latitude,
                administrative_province=province,
                administrative_city=city,
                administrative_district=district,
                company=company
            )

            road.save()

            # 返回成功响应
            return JsonResponse({'status': 'success', 'message': '道路信息已成功保存。'})

        except Exception as e:
            # 发生错误时返回错误信息
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    else:
        # 非POST请求时返回错误信息
        return JsonResponse({'status': 'error', 'message': '无效的请求类型。'}, status=400)


def get_road_info(request):
    user = request.user

    # 检查用户是否存在
    if not user.is_authenticated:
        return JsonResponse({'error': '用户未登录'}, status=401)

    try:
        user_role = UserRole.objects.get(user=user)

        # 获取用户所属公司ID
        company_id = user_role.company.company_id

        roads = Road.objects.filter(company_id=company_id)

        # 构造道路信息列表
        road_list = [
            {
                'road_id': str(road.road_id),
                'road_name': road.road_name,
                'gps_longitude': float(road.gps_longitude),
                'gps_latitude': float(road.gps_latitude),
                'administrative_province': road.administrative_province,
                'administrative_city': road.administrative_city,
                'administrative_district': road.administrative_district
            } for road in roads
        ]

        return JsonResponse(road_list, safe=False)

    except UserRole.DoesNotExist:
        return JsonResponse({'error': '用户角色信息不存在'}, status=444)


@require_http_methods(["GET"])
def get_user_info(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "未认证的用户"}, status=401)

    current_user = request.user

    try:
        # 获取用户角色信息
        user_role = UserRole.objects.get(user=current_user)

        # 获取公司信息
        company = Company.objects.get(company_id=user_role.company.company_id)

        # 计算用户上传文件的总数
        total_upload_count = UploadRecord.objects.filter(uploader=user_role).aggregate(
            total_uploaded_files=Sum('upload_count')
        )['total_uploaded_files'] or 0

        # 准备要返回的用户信息
        user_info = {
            "user_id": current_user.id,
            "username": current_user.username,
            "employee_number": user_role.employee_number,
            "phone_number": user_role.phone_number,
            "user_level": user_role.get_user_level_display(),
            "gender": user_role.get_gender_display(),
            "email": user_role.email,
            "company_name": company.company_name,
            "avatar_url": user_role.avatar_url,
            "upload_count": total_upload_count,
        }

        return JsonResponse(user_info)

    except UserRole.DoesNotExist:
        return JsonResponse({"error": "用户信息未找到"}, status=444)
    except Company.DoesNotExist:
        return JsonResponse({"error": "公司信息未找到"}, status=444)


@require_http_methods(["POST"])
def change_user_info(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "未认证的用户"}, status=401)

    # 获取当前用户和用户角色信息
    current_user = request.user
    try:
        user_role = UserRole.objects.get(user=current_user)
    except UserRole.DoesNotExist:
        return JsonResponse({"error": "用户角色信息未找到"}, status=404)

    # 从POST请求中获取信息
    new_email = request.POST.get('email', user_role.email)
    new_phone_number = request.POST.get('phone_number', user_role.phone_number)
    new_username = request.POST.get('username', current_user.username)
    new_gender = request.POST.get('gender', user_role.gender)

    # 检查UserRole信息是否有变化
    user_role_changes = (
        new_email != user_role.email or
        new_phone_number != user_role.phone_number or
        new_gender != user_role.gender
    )

    # 检查User信息是否有变化
    user_changes = new_username != current_user.username

    if user_role_changes:
        # 更新UserRole信息
        user_role.email = new_email
        user_role.phone_number = new_phone_number
        user_role.gender = new_gender

        user_role.save()

    if user_changes:
        # 更新User信息
        current_user.username = new_username
        current_user.save()

    if user_role_changes or user_changes:
        return JsonResponse({"message": "用户信息已更新"}, status=200)

    return JsonResponse({"message": "没有检测到信息变化"}, status=304)


@require_http_methods(["POST"])
def change_password(request):
    if request.method == 'POST':
        user = request.user
        old_password = request.POST['old_password']
        new_password = request.POST['new_password']

        if user.check_password(old_password):
            user.set_password(new_password)
            user.save()
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Wrong password'}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)


def get_employee_number_length(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "未认证的用户"}, status=401)

    current_user = request.user

    try:
        # 获取用户角色信息
        user_role = UserRole.objects.get(user=current_user)

        # 获取公司信息
        company = Company.objects.get(company_id=user_role.company.company_id)

        # 准备要返回的用户信息
        employee_number_length = {
            "employee_number_length": company.employee_number_length
        }

        return JsonResponse(employee_number_length)

    except UserRole.DoesNotExist:
        return JsonResponse({"error": "用户信息未找到"}, status=444)
    except Company.DoesNotExist:
        return JsonResponse({"error": "公司信息未找到"}, status=444)


# @require_http_methods(["POST"])
# def change_employee_number_length(request):
#     if not request.user.is_authenticated:
#         return JsonResponse({"error": "未认证的用户"}, status=401)
#
#     current_user = request.user
#
#     try:
#         # 获取用户角色信息
#         user_role = UserRole.objects.get(user=current_user)
#
#         # 检查用户权限
#         if user_role.user_level != 0:
#             return JsonResponse({"error": "无权限更改工号长度"}, status=403)
#
#         # 获取POST请求中的新员工号码长度
#         new_length = request.POST.get('new_length')
#         if new_length:
#             new_length = int(new_length)
#         else:
#             return JsonResponse({"error": "未提供新的员工号码长度"}, status=400)
#
#         # 获取公司信息并更新员工号码长度
#         company = Company.objects.get(company_id=user_role.company.company_id)
#         company.employee_number_length = new_length
#         company.save()
#
#         return JsonResponse({"message": "员工号码长度更新成功"})
#
#     except UserRole.DoesNotExist:
#         return JsonResponse({"error": "用户信息未找到"}, status=404)
#     except Company.DoesNotExist:
#         return JsonResponse({"error": "公司信息未找到"}, status=404)
#     except ValueError:
#         return JsonResponse({"error": "无效的员工号码长度"}, status=400)


def get_upload_records(request):
    current_user = request.user

    try:
        user_role = UserRole.objects.get(user=current_user)
    except UserRole.DoesNotExist:
        return JsonResponse({'error': '用户角色未找到'}, status=404)

    # 获取当前用户及其下属用户的ID
    user_ids = [user_role.id] + get_subordinate_user_ids(user_role)

    # 查询对应的上传记录
    records = UploadRecord.objects.filter(uploader_id__in=user_ids).values(
        'upload_id', 'upload_time', 'uploader__user__username', 'road__road_id',
        'road__road_name', 'upload_name', 'upload_count'
    )

    return JsonResponse(list(records), safe=False)


def get_subordinate_user_ids(user):
    # 基于用户的等级和下属关系，获取所有下属用户的ID
    subordinate_ids = []
    if user.user_level == 0:
        # 获取Level 1下属
        level1_users = UserRole.objects.filter(supervisor=user)
        subordinate_ids += list(level1_users.values_list('id', flat=True))
        # 获取Level 2下属
        for level1_user in level1_users:
            level2_users = UserRole.objects.filter(supervisor=level1_user)
            subordinate_ids += list(level2_users.values_list('id', flat=True))
    elif user.user_level == 1:
        # 获取Level 2下属
        level2_users = UserRole.objects.filter(supervisor=user)
        subordinate_ids += list(level2_users.values_list('id', flat=True))

    return subordinate_ids


@require_http_methods(["POST"])
def update_selected_model(request):
    try:
        user_id = request.POST.get('user_id')
        new_model = int(request.POST.get('selected_model'))

        # 确保 new_model 是有效的选择
        if new_model not in [0, 1, 2, 3]:
            return JsonResponse({'error': 'Invalid model selection'}, status=400)

        # 查找并更新用户角色
        user_role = UserRole.objects.get(user_id=user_id)
        user_role.selected_model = new_model
        user_role.save()

        return JsonResponse({'message': 'Model updated successfully'})

    except ObjectDoesNotExist:
        return JsonResponse({'error': 'UserRole not found'}, status=404)
    except ValueError:
        # 处理类型转换错误
        return JsonResponse({'error': 'Invalid data format'}, status=400)
    except Exception as e:
        # 其他潜在错误
        return JsonResponse({'error': str(e)}, status=500)


@require_http_methods(["GET"])
def get_selected_model(request):
    try:
        user_id = request.GET.get('user_id')

        # 查找用户角色
        user_role = UserRole.objects.get(user_id=user_id)

        return JsonResponse({'selected_model': user_role.selected_model})

    except ObjectDoesNotExist:
        return JsonResponse({'error': 'UserRole not found'}, status=404)
    except Exception as e:
        # 其他潜在错误
        return JsonResponse({'error': str(e)}, status=500)


