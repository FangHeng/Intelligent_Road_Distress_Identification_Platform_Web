from django.contrib import admin
from .models import UserRole, Company

# 用户角色表的管理界面设置
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ['user', 'employee_number', 'user_level', 'phone_number', 'email', 'company', 'avatar_url', 'supervisor']
    search_fields = ['user__username', 'employee_number', 'company__company_name']


# 公司信息表的管理界面设置
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'employee_number_length']
    search_fields = ['company_name']


# 注册模型及其对应的Admin类到Django admin
admin.site.register(UserRole, UserRoleAdmin)
admin.site.register(Company, CompanyAdmin)