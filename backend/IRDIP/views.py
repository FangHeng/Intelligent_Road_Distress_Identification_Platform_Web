import os
import json
import uuid

from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.http import JsonResponse
from .models import UserRole, UploadRecord, FileUpload, Company, Road
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.utils import timezone

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
    if request.method == 'POST':
        user_role = UserRole.objects.get(user=request.user)
        user_id = user_role.id
        upload_time = timezone.now()  # 获取当前时间
        folder_name = f'uploads/{user_id}/{upload_time.strftime("%Y%m%d%H%M%S")}'
        os.makedirs(folder_name, exist_ok=True)

        upload_record = UploadRecord.objects.create(
            upload_time=upload_time,
            folder_url=folder_name,
            uploader_id=user_id,
            road_id=request.POST['road_id'],
            upload_name=request.POST['upload_name'],
            upload_count=len(request.FILES)
        )

        for f in request.FILES.values():
            file_name = uuid.uuid4().hex  # 生成唯一的文件名
            file_path = os.path.join(folder_name, file_name)
            handle_uploaded_file(f, file_path)

            # 假设你有一个predict函数来处理文件并返回结果
            result = predict(user_id, upload_time, file_path)
            FileUpload.objects.create(
                upload=upload_record,
                file_url=file_path,
                classification_result=result['classification'],
                confidence=result['confidence']
            )

        return JsonResponse({'message': 'Upload successful'})
    return JsonResponse({'error': 'Invalid request'}, status=400)


def handle_uploaded_file(f, file_name):
    with open(file_name, 'wb+') as destination:
        for chunk in f.chunks():
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

        # 构造道路信息字典
        road_list = {
            str(road.road_id): {
                'road_name': road.road_name,
                'gps_longitude': float(road.gps_longitude),
                'gps_latitude': float(road.gps_latitude),
                'administrative_province': road.administrative_province,
                'administrative_city': road.administrative_city,
                'administrative_district': road.administrative_district
            } for road in roads
        }

        return JsonResponse(road_list)

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