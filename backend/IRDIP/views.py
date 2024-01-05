import os
import json
import uuid
import pytz
import base64
import shutil
import random
import pandas
from openpyxl import Workbook

from django.contrib.auth.models import User
from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.http import JsonResponse, HttpResponse
from .models import UserRole, UploadRecord, FileUpload, Company, Road
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.conf import settings
from django.db.models import Sum, Count, Q
from django.core.mail import EmailMessage
from django.core.cache import cache
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from PDC_predict.predict import predict
from IRDIP.LLM import format_report

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
        password = request.POST.get('password')
        employee_number = request.POST.get('employee_number')
        username = employee_number  # 初始化时用户名与工号相同

        # 检查工号是否在同一公司内已被使用
        if UserRole.objects.filter(company=current_user_role.company, employee_number=employee_number).exists():
            return JsonResponse({'status': 'error', 'message': 'Employee number already exists in the company'}, status=400)

        # 创建新用户
        new_user = User.objects.create_user(username=username)

        # 尝试设置密码，如果不符合Django的安全标准则返回错误
        try:
            new_user.set_password(password)
            new_user.save()
        except ValidationError as e:
            new_user.delete()  # 如果密码无效，删除创建的用户
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

        new_user_role = UserRole.objects.create(
            user=new_user,
            employee_number=employee_number,
            user_level=current_user_role.user_level + 1,
            company=current_user_role.company,
            supervisor=current_user_role
        )

        return JsonResponse({'status': 'success', 'message': 'User registered successfully'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)

@require_http_methods(["DELETE"])
def delete_subordinate(request, user_id):
    if request.method == 'DELETE':
        current_user = request.user
        current_user_role = UserRole.objects.get(user=current_user)

        # 获取当前用户的所有下属用户ID
        subordinate_ids = get_subordinate_user_ids(current_user_role)

        # 检查是否存在该下属用户并且当前用户是否有权删除
        if user_id not in subordinate_ids:
            return JsonResponse({'status': 'error', 'message': 'Unauthorized or user not found'}, status=403)

        # 删除用户及其相关数据
        try:
            subordinate_user_role = UserRole.objects.get(id=user_id)
            UploadRecord.objects.filter(uploader=subordinate_user_role).delete()

            # 删除用户文件夹
            user_folders = [os.path.join('uploads', str(user_id)), os.path.join('avatar', str(user_id))]
            for folder in user_folders:
                if os.path.exists(folder):
                    shutil.rmtree(folder)

            subordinate_user_role.user.delete()  # 这会级联删除UserRole
        except ObjectDoesNotExist:
            return JsonResponse({'status': 'error', 'message': '用户没发现！'}, status=404)

        return JsonResponse({'status': 'success', 'message': '删除成功！'})

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

    # 如果没有找到下属用户，返回空列表
    if not subordinates:
        return JsonResponse([], safe=False, status=200)

    subordinates_info = []
    for subordinate in subordinates:
        # 检查用户是否激活（有最后登录时间）
        is_active = subordinate.user.last_login is not None

        # 获取上传记录数量和上传文件总数
        upload_stats = UploadRecord.objects.filter(uploader=subordinate).aggregate(
            upload_record_count=Count('upload_id'), total_files=Sum('upload_count'))

        subordinates_info.append({
            'user_id': subordinate.id,
            'employee_number': subordinate.employee_number,
            'last_login': subordinate.user.last_login,
            'is_active': is_active,
            'user_level': subordinate.get_user_level_display(),
            'upload_record_count': upload_stats['upload_record_count'] or 0,
            'total_upload_files': upload_stats['total_files'] or 0,
        })
        # print(subordinates_info)

    return JsonResponse(subordinates_info, safe=False, status=200)


@ensure_csrf_cookie
def get_company_info(request):
    # 查询所有公司
    companies = Company.objects.all()

    company_list = {str(company.company_id): company.company_name for company in companies}

    return JsonResponse(company_list)


def upload(request):
    print(request)
    # try:
    #     if request.method == 'POST':
    #         user_role = UserRole.objects.get(user=request.user)
    #         user_id = user_role.id
    #         # 设置北京时区并获取当前时间
    #         tz = pytz.timezone('Asia/Shanghai')
    #         upload_time = timezone.now().astimezone(tz)
    #         folder_name = f'uploads/{user_id}/{upload_time.strftime("%Y%m%d%H%M%S")}'
    #         os.makedirs(folder_name, exist_ok=True)
    #
    #         # 从表单数据中获取 imageInfo
    #         image_info = {
    #             'title': request.POST.get('title', ''),
    #             'road': request.POST.get('road', '')
    #         }
    #
    #         upload_count = sum(len(request.FILES.getlist(field_name)) for field_name in request.FILES)
    #
    #         upload_record = UploadRecord.objects.create(
    #             upload_time=upload_time,
    #             folder_url=folder_name,
    #             uploader_id=user_id,
    #             road_id=image_info['road'],
    #             upload_name=image_info['title'],
    #             upload_count=upload_count,
    #             selected_model=user_role.selected_model,
    #         )
    #
    #         for field_name, files in request.FILES.lists():
    #             for file in files:
    #                 original_name = file.name
    #                 file_name = uuid.uuid4().hex
    #                 extension = os.path.splitext(original_name)[1]  # 提取文件后缀
    #                 file_path = os.path.join(folder_name, file_name + extension)  # 使用上传的文件的原始文件名
    #
    #                 handle_uploaded_file(file, file_path)
    #
    #         # predictions = {}
    #         predictions = predict(user=user_id, time=upload_time.strftime("%Y%m%d%H%M%S"), model='swin')
    #         for file_name, result in predictions.items():
    #             classification_int = classification_mapping.get(result['class'], -1)
    #             FileUpload.objects.create(
    #                 upload=upload_record,
    #                 file_url=os.path.join(folder_name, file_name),
    #                 classification_result=classification_int,
    #                 confidence=result['probability']
    #             )
    #
    #         return JsonResponse({'message': 'Upload successful'}, status=200)
    # except UserRole.DoesNotExist:
    #     return JsonResponse({'error': 'User role not found'}, status=404)
    # except OSError as e:
    #     return JsonResponse({'error': f'File system error: {e}'}, status=500)
    # except Exception as e:
    #     return JsonResponse({'error': f'An unexpected error occurred: {e}'}, status=501)
    #
    # return JsonResponse({'error': 'Invalid request'}, status=400)
    if request.method == 'POST':
        # print(request.user.id)
        user_role = UserRole.objects.get(user=request.user)
        user_id = user_role.id
        # 设置中国时区并获取当前时间
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
            upload_count=upload_count,
            selected_model=user_role.selected_model,
        )

        for field_name, files in request.FILES.lists():
            for file in files:
                original_name = file.name
                # file_name = uuid.uuid4().hex                    # 使用uuid作为文件名
                file_name = os.path.splitext(original_name)[0]  # 使用上传的文件的原始文件名
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


def handle_uploaded_file(f, file_name):
    with open(file_name, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)


@require_http_methods(["GET"])
def get_result(request):
    upload_ids = request.GET.getlist('upload_id')
    # print(upload_ids)
    response_data = {}
    request_user = request.user

    upload_records = UploadRecord.objects.filter(upload_id__in=upload_ids).select_related('uploader', 'road')

    for upload_record in upload_records:
        uploader = upload_record.uploader.user

        # 检查是否有权访问此上传记录
        if not is_upload_accessible_by_user(uploader, request_user):
            # print("unable to access")
            continue

        files = FileUpload.objects.filter(upload=upload_record).select_related('upload')

        # 构建响应数据
        upload_data = {
            "uploader": upload_record.uploader.user.username,
            "road": upload_record.road.road_id,
            "road_name": upload_record.road.road_name,
            "upload_name": upload_record.upload_name,
            "upload_count": upload_record.upload_count,
            "selected_model": upload_record.get_selected_model_display(),
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
        if upload_user.userrole.supervisor.id == request_user.userrole.id:
            return True
        # 检查上传者的上级的上级用户
        if upload_user.userrole.supervisor.id and upload_user.userrole.supervisor.supervisor.id == request_user.userrole.id:
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
            # print(f"upload_id: {str(upload_record.upload_id)}")
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

        # 映射selected_model的整数值到其对应的模型名称
        model_mapping = {
            0: 'Swin',
            1: 'WSPLIN-IP',
            2: 'WSPLIN-SS',
            3: 'PicT'
        }

        avatar = None
        if user_role.avatar_url:
            avatar = get_base64_encoded_image(user_role.avatar_url)

        user_info = {
            "user_id": current_user.id,
            "username": current_user.username,
            "employee_number": user_role.employee_number,
            "phone_number": user_role.phone_number,
            "user_level": user_role.get_user_level_display(),
            "gender": user_role.gender,
            "email": user_role.email,
            "company_name": company.company_name,
            "avatar": avatar,
            "upload_count": total_upload_count,
            "selected_model": model_mapping.get(user_role.selected_model, "Unknown")
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
    # print(new_email, new_phone_number, new_username, new_gender)

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

        # 如果电子邮件发生变化，也更新User表中的电子邮件
        if new_email != current_user.email:
            current_user.email = new_email
            current_user.save()

    if user_changes:
        # 更新User信息
        current_user.username = new_username
        current_user.save()

    if user_role_changes or user_changes:
        return JsonResponse({"message": "用户信息已更新"}, status=200)

    return JsonResponse({"message": "没有检测到信息变化"}, status=304)


def upload_avatar(request):
    try:
        if request.method == 'POST':
            user_role = UserRole.objects.get(user=request.user)

            # 检查是否有文件被上传
            if 'avatar' in request.FILES:
                user_id = user_role.id
                avatar_file = request.FILES['avatar']
                folder_name = 'avatars/'
                file_extension = os.path.splitext(avatar_file.name)[1]
                unique_file_name = uuid.uuid4().hex + file_extension

                # 创建用户的头像存储目录
                user_avatar_folder = os.path.join(folder_name, str(user_id))
                os.makedirs(user_avatar_folder, exist_ok=True)

                file_path = os.path.join(user_avatar_folder, unique_file_name)

                # 删除旧头像文件
                old_avatar_path = user_role.avatar_url
                if old_avatar_path:
                    full_old_avatar_path = os.path.join(settings.MEDIA_ROOT, old_avatar_path)
                    if os.path.isfile(full_old_avatar_path):
                        os.remove(full_old_avatar_path)

                # 保存文件
                handle_uploaded_file(avatar_file, file_path)

                user_role.avatar_url = file_path
                user_role.save()

                return JsonResponse({'message': 'Avatar uploaded successfully', 'url': file_path}, status=200)
            else:
                return JsonResponse({'error': 'No avatar file provided'}, status=400)
    except UserRole.DoesNotExist:
        return JsonResponse({'error': 'User role not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {e}'}, status=500)


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
    records = UploadRecord.objects.filter(uploader_id__in=user_ids).annotate(
        intact_count=Count('fileupload', filter=Q(fileupload__classification_result=6))
    ).order_by('-upload_time').values(
        'upload_id', 'upload_time', 'uploader__user__username',
        'road__road_id', 'road__road_name', 'upload_name', 'upload_count',
        'road__gps_longitude', 'road__gps_latitude', 'selected_model', 'intact_count'
    )

    # 将查询结果转换为列表并更新模型名称，同时计算完好比例（integrity）
    records_list = list(records)
    for record in records_list:
        upload_record_instance = UploadRecord.objects.get(upload_id=record['upload_id'])
        record['selected_model'] = upload_record_instance.get_selected_model_display()
        record['integrity'] = (record['intact_count'] / record['upload_count'] * 100) if record['upload_count'] > 0 else 0

    return JsonResponse(records_list, safe=False)


@require_http_methods(["DELETE"])
def delete_upload_record(request, upload_id):
    if request.method == 'DELETE':
        # 检查上传记录是否存在
        try:
            upload_record = UploadRecord.objects.get(upload_id=upload_id)
        except ObjectDoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Upload record not found'}, status=404)

        # 获取文件夹URL并删除本地文件夹
        folder_url = upload_record.folder_url
        if os.path.exists(folder_url):
            shutil.rmtree(folder_url)

        # 删除上传记录及相关文件上传数据
        upload_record.delete()  # 这会级联删除关联的FileUpload记录

        return JsonResponse({'status': 'success', 'message': '删除成功！'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)


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


@require_http_methods(["POST"])
def change_selected_model(request):
    user = request.user
    model_name = request.POST.get('update_model')

    if model_name is None:
        return JsonResponse({'status': 'error', 'message': 'No model selected'}, status=400)

    # 将模型名称映射到对应的整数
    model_mapping = {
        'Swin': 0,
        'WSPLIN-IP': 1,
        'WSPLIN-SS': 2,
        'PicT': 3
    }

    update_model = model_mapping.get(model_name)

    # 检查是否是有效的模型选择
    if update_model is None:
        return JsonResponse({'status': 'error', 'message': 'Invalid model selection'}, status=400)

    try:
        user_role = UserRole.objects.get(user=user)
        user_role.selected_model = update_model
        user_role.save()
    except UserRole.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User role not found'}, status=404)

    return JsonResponse({'status': 'success', 'message': 'Model updated successfully'}, status=200)


@require_http_methods(["POST"])
def send_email_verification(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        user = User.objects.filter(email=email).first()
        if user:
            # 生成随机验证码
            verification_code = str(random.randint(100000, 999999))
            # 设置验证码在缓存中的有效期为30分钟
            cache.set(f'verification_code_{email}', verification_code, timeout=600)

            # 邮件内容
            subject = '您的智能路面病害分析平台账户验证码'
            message = f"""
                尊敬的 {user.username},
                
                我们收到了一个请求，用于重置您在智能路面病害分析平台的账户密码。要继续重置密码，请使用以下验证码：
                
                验证码: {verification_code}
                
                请在密码重置页面输入此验证码。该验证码将在10分钟后过期。
                
                如果您未请求重置密码，请忽略此邮件或在认为有未经授权的操作时立即通过 hengfang2002@qq.com 与我们联系。
                
                为了您的安全，请不要与他人分享您的验证码。
                
                感谢您使用智能路面病害分析平台。我们致力于为您提供最可靠、最安全的道路病害分析服务。
                
                此致，
                您的智能路面病害分析平台团队
            """
            # 发送邮件
            mail = EmailMessage(
                subject=subject,
                body=message,
                from_email=settings.EMAIL_HOST_USER,
                to=[email],
                reply_to=[email]
            )
            mail.encoding = 'utf-8'  # 指定编码为 UTF-8，否则默认的ascii编码会导致错误
            mail.send()

            return JsonResponse({'status': 'success', 'message': '验证码已发送'}, status=200)
        else:
            return JsonResponse({'status': 'error', 'message': '未注册的邮箱'}, status=400)


@require_http_methods(["POST"])
def change_password_with_email_verification(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        user = User.objects.filter(email=email).first()

        if user:
            submitted_code = request.POST.get('code')
            new_password = request.POST.get('new_password')

            # 从缓存中获取验证码
            cached_code = cache.get(f'verification_code_{email}')

            if cached_code and submitted_code == cached_code:
                user.set_password(new_password)
                user.save()
                # 成功更新密码，清除缓存中的验证码
                cache.delete(f'verification_code_{email}')
                return JsonResponse({'message': '成功更新密码'}, status=200)
            else:
                # 验证码不匹配或已过期
                return JsonResponse({'error': '验证码不匹配或已过期'}, status=400)
        else:
            # 邮箱未注册
            return JsonResponse({'error': '邮箱未注册'}, status=444)
    else:
        # 错误的请求方法
        return JsonResponse({'error': '错误的请求'}, status=405)


@require_http_methods(["GET"])
def export_to_excel(request):
    try:
        upload_ids = request.GET.getlist('upload_id')
        request_user = request.user

        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        )
        response['Content-Disposition'] = 'attachment; filename=exported_data.xlsx'
        workbook = Workbook()
        sheet = workbook.active
        sheet.title = 'Upload Records'

        column_titles = ["Upload ID", "Uploader", "Employee number", "Road Name", "Upload Name",
                         "File ID", "File Name", "Classification Result", "Confidence"]
        sheet.append(column_titles)

        # 分类结果映射
        classification_mapping = {
            0: "cementation_fissures",
            1: "crack",
            2: "longitudinal_crack",
            3: "loose",
            4: "massive_crack",
            5: "mending",
            6: "normal",
            7: "transverse_crack"
        }

        upload_records = UploadRecord.objects.filter(upload_id__in=upload_ids).select_related('uploader', 'road')

        if not upload_records:
            raise ObjectDoesNotExist("No upload records found for the provided IDs.")

        for upload_record in upload_records:
            uploader = upload_record.uploader.user

            if not is_upload_accessible_by_user(uploader, request_user):
                continue

            files = FileUpload.objects.filter(upload=upload_record).select_related('upload')

            for file in files:
                row = [
                    str(upload_record.upload_id),
                    upload_record.uploader.user.username,
                    upload_record.uploader.employee_number,
                    upload_record.road.road_name,
                    upload_record.upload_name,
                    file.file_id,
                    os.path.basename(file.file_url),
                    classification_mapping.get(file.classification_result, "Unknown"),
                    float(file.confidence),
                ]
                sheet.append(row)

        workbook.save(response)
        return response

    except ObjectDoesNotExist as e:
        return JsonResponse({"error": str(e)}, status=404)

    except Exception as e:
        # 捕获其他所有未预期的错误
        return JsonResponse({"error": "An unexpected error occurred: " + str(e)}, status=500)


def get_result_by_upload_ids(upload_ids, request_user):
    response_data = {}

    upload_records = UploadRecord.objects.filter(upload_id__in=upload_ids).select_related('uploader', 'road')

    for upload_record in upload_records:
        uploader = upload_record.uploader.user

        # 检查是否有权访问此上传记录
        if not is_upload_accessible_by_user(uploader, request_user):
            continue

        files = FileUpload.objects.filter(upload=upload_record).select_related('upload')

        # 计算破损比例
        total_files_count = FileUpload.objects.filter(upload=upload_record).count()
        damaged_files_count = FileUpload.objects.filter(upload=upload_record).exclude(classification_result=6).count()
        damage_ratio = damaged_files_count / total_files_count if total_files_count else 0

        road_info = upload_record.road

        # 构建响应数据
        upload_data = {
            "uploader": upload_record.uploader.user.username,
            "upload_time": upload_record.upload_time,
            "road_info": {
                "road_id": road_info.road_id,
                "road_name": road_info.road_name,
                "gps_longitude": road_info.gps_longitude,
                "gps_latitude": road_info.gps_latitude,
                "administrative_province": road_info.administrative_province,
                "administrative_city": road_info.administrative_city,
                "administrative_district": road_info.administrative_district
            },
            "upload_name": upload_record.upload_name,
            "upload_count": upload_record.upload_count,
            "selected_model": upload_record.get_selected_model_display(),
            "damage_ratio": damage_ratio
        }

        response_data[str(upload_record.upload_id)] = upload_data

    # 处理不存在的 upload_id
    missing_ids = set(upload_ids) - set(str(upload.upload_id) for upload in upload_records)
    for missing_id in missing_ids:
        response_data[missing_id] = "Upload record not found"

    return response_data


@require_http_methods(["GET"])
def generate_report(request):
    try:
        # 获取上传ID列表
        upload_ids = request.GET.getlist('upload_id')
        request_user = request.user

        # 获取先验信息
        prior_information = get_result_by_upload_ids(upload_ids, request_user)

        # 准备报告所需的信息
        report_data = []
        for upload_id, info in prior_information.items():
            if info != "Upload record not found":
                report_data.append({
                    "theme": f"Upload Report for {info['upload_name']}",
                    "uploader": info["uploader"],
                    "upload_time": info["upload_time"].strftime("%Y-%m-%d %H:%M:%S"),
                    "road_name": info["road_info"]["road_name"],
                    "province": info["road_info"]["administrative_province"],
                    "city": info["road_info"]["administrative_city"],
                    "district": info["road_info"]["administrative_district"],
                    "gps_longitude": info["road_info"]["gps_longitude"],
                    "gps_latitude": info["road_info"]["gps_latitude"],
                    "upload_count": info["upload_count"],
                    "damage_ratio": info["damage_ratio"],
                    "selected_model": info["selected_model"]
                })
            else:
                report_data.append({"upload_id": upload_id, "error": "Upload record not found"})

        # 生成格式化报告
        formatted_report = format_report(prior_information=report_data)

        print(report_data)

        # 合并两部分信息
        combined_response = report_data + formatted_report

        # 返回成功响应
        return JsonResponse(combined_response, safe=False)

    except Exception as e:
        error_message = {"error": str(e)}
        return JsonResponse(error_message, status=500)