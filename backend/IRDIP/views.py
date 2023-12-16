import os
import json
import uuid
import base64
import pytz

from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.http import JsonResponse
from .models import UserRole, UploadRecord, FileUpload, Company, Road
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.core.files.base import ContentFile

from PDC_predict.predict import predict

def index(request):
    return render(request)


@csrf_exempt
def login(request):
    # print("====================================")
    # print(request.COOKIES)
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

                return JsonResponse({"status": "success"})
            else:
                # 认证失败
                return JsonResponse({"status": "error", "message": "Invalid credentials"}, status=401)
        except UserRole.DoesNotExist:
            return JsonResponse({"status": "error", "message": "User not found"}, status=444)
    else:
        # 非 POST 请求
        return JsonResponse({"status": "error", "message": "Invalid request"}, status=400)


# @ensure_csrf_cookie
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

            predictions = {}
            # predictions = predict(user=user_id, time=upload_time.strftime("%Y%m%d%H%M%S"), model='swin')
            for file_name, result in predictions.items():
                FileUpload.objects.create(
                    upload=upload_record,
                    file_url=os.path.join(folder_name, file_name),
                    classification_result=result['class'],
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


def handle_uploaded_file(f, file_name):
    with open(file_name, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)


def save_base64_file(encoded_data, file_path):
    format, imgstr = encoded_data.split(';base64,')  # 分割数据格式和实际的Base64字符串
    ext = format.split('/')[-1]  # 获取文件扩展名
    data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)  # 解码和封装文件内容
    with open(file_path, 'wb+') as destination:
        for chunk in data.chunks():
            destination.write(chunk)

@csrf_exempt
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
            "avatar_url": user_role.avatar_url
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


@require_http_methods(["POST"])
def change_employee_number_length(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "未认证的用户"}, status=401)

    current_user = request.user

    try:
        # 获取用户角色信息
        user_role = UserRole.objects.get(user=current_user)

        # 检查用户权限
        if user_role.user_level != 0:
            return JsonResponse({"error": "无权限更改工号长度"}, status=403)

        # 获取POST请求中的新员工号码长度
        new_length = request.POST.get('new_length')
        if new_length:
            new_length = int(new_length)
        else:
            return JsonResponse({"error": "未提供新的员工号码长度"}, status=400)

        # 获取公司信息并更新员工号码长度
        company = Company.objects.get(company_id=user_role.company.company_id)
        company.employee_number_length = new_length
        company.save()

        return JsonResponse({"message": "员工号码长度更新成功"})

    except UserRole.DoesNotExist:
        return JsonResponse({"error": "用户信息未找到"}, status=404)
    except Company.DoesNotExist:
        return JsonResponse({"error": "公司信息未找到"}, status=404)
    except ValueError:
        return JsonResponse({"error": "无效的员工号码长度"}, status=400)


