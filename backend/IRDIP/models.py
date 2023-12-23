from django.db import models
from django.contrib.auth.models import User
import uuid


# 用户角色表
class UserRole(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    employee_number = models.CharField(max_length=255)
    user_level = models.IntegerField(choices=[(0, 'Level 0'), (1, 'Level 1'), (2, 'Level 2')])
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], default='Male')
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    company = models.ForeignKey('Company', on_delete=models.CASCADE)
    avatar_url = models.URLField(null=True, blank=True)
    supervisor = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    selected_model = models.IntegerField(choices=[(0, 'Swin'), (1, 'WSPLIN-IP'), (2, 'WSPLIN-SS'),(3, "PicT")], default=0)

# 上传记录表
class UploadRecord(models.Model):
    upload_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    upload_time = models.DateTimeField()
    folder_url = models.CharField(max_length=255)
    uploader = models.ForeignKey('UserRole', on_delete=models.CASCADE)
    road = models.ForeignKey('Road', on_delete=models.CASCADE)
    upload_name = models.CharField(max_length=255)
    upload_count = models.IntegerField()
    selected_model = models.IntegerField(choices=[(0, 'Swin'), (1, 'WSPLIN-IP'), (2, 'WSPLIN-SS'),(3, "PicT")], default=0)

# 文件上传表
class FileUpload(models.Model):
    file_id = models.AutoField(primary_key=True)
    upload = models.ForeignKey(UploadRecord, on_delete=models.CASCADE)
    file_url = models.CharField(max_length=255)
    classification_result = models.IntegerField(choices=[(i, f'Class {i}') for i in range(8)])
    confidence = models.DecimalField(max_digits=5, decimal_places=4)

# 公司信息表
class Company(models.Model):
    company_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company_name = models.CharField(max_length=255)
    employee_number_length = models.IntegerField()

# 道路表
class Road(models.Model):
    road_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    road_name = models.CharField(max_length=255)
    gps_longitude = models.DecimalField(max_digits=10, decimal_places=6)
    gps_latitude = models.DecimalField(max_digits=10, decimal_places=6)
    administrative_province = models.CharField(max_length=100)
    administrative_city = models.CharField(max_length=100)
    administrative_district = models.CharField(max_length=100)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
