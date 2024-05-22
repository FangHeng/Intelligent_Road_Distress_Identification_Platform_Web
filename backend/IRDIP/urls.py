# -*- coding: utf-8 -*-
# @Time    : 2023/12/15 02:30
# @Author  : Fang Heng
# @File    : urls.py
# @Software: PyCharm 
# @Comment :


from django.contrib import admin
from django.urls import path, include
from IRDIP import views

app_name = 'IRDIP'

urlpatterns = [
    path("", views.index, name="index"),
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),
    path("register_subordinate/", views.register_subordinate, name="register_subordinate"),
    path("delete_subordinate/<uuid:user_id>/", views.delete_subordinate, name="delete_subordinate"),
    path("get_subordinates_info/", views.get_subordinates_info, name="get_subordinates_info"),
    path("get_company_info/", views.get_company_info, name="get_company_info"),
    path("upload/", views.upload, name="upload"),
    path("upload_compressed/", views.upload_compressed, name="upload_compressed"),
    path("get_result/", views.get_result, name="get_result"),
    path('check_upload_status/', views.check_upload_status, name='check_upload_status'),
    path("get_lasted_upload_id/", views.get_lasted_upload_id, name="get_lasted_upload_id"),
    path("road_registration/", views.road_registration, name="road_registration"),
    path("get_road_info/", views.get_road_info, name="get_road_info"),
    path("get_user_info/", views.get_user_info, name="get_user_info"),
    path("change_user_info/", views.change_user_info, name="change_user_info"),
    path("upload_avatar/", views.upload_avatar, name="upload_avatar"),
    path("change_password/", views.change_password, name="change_password"),
    path("get_employee_number_length/", views.get_employee_number_length, name="get_employee_number_length"),
    # path("change_employee_number_length/", views.change_employee_number_length, name="change_employee_number_length"),
    path("get_upload_records/", views.get_upload_records, name="get_upload_records"),
    path("delete_upload_record/<uuid:upload_id>/", views.delete_upload_record, name="delete_upload_record"),
    path("get_selected_model/", views.get_selected_model, name="get_selected_model"),
    path("change_selected_model/", views.change_selected_model, name="change_selected_model"),
    path("send_email_verification/", views.send_email_verification, name="send_email_verification"),
    path("change_password_with_email_verification/", views.change_password_with_email_verification, name="change_password_with_email_verification"),
    path("export_to_excel/", views.export_to_excel, name="export_to_excel"),
    path("generate_report/", views.generate_report, name="generate_report"),
    path('get_user_id/', views.get_user_id, name='get_user_id'),
]