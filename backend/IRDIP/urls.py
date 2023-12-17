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
    path("get_company_info/", views.get_company_info, name="get_company_info"),
    path("upload/", views.upload, name="upload"),
    path("get_result/", views.get_result, name="get_result"),
    path("get_lasted_upload_id/", views.get_lasted_upload_id, name="get_lasted_upload_id"),
    path("road_registration/", views.road_registration, name="road_registration"),
    path("get_road_info/", views.get_road_info, name="get_road_info"),
    path("get_user_info/", views.get_user_info, name="get_user_info"),
    path("change_user_info/", views.change_user_info, name="change_user_info"),
    path("get_employee_number_length/", views.get_employee_number_length, name="get_employee_number_length"),
    # path("change_employee_number_length/", views.change_employee_number_length, name="change_employee_number_length"),


]