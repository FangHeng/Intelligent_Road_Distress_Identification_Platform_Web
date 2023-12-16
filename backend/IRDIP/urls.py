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
    path("get_company_info/", views.get_company_info, name="get_company_info"),
    path("upload/", views.upload, name="upload"),
    path("road_registration/", views.road_registration, name="road_registration"),
    path("get_road_info/", views.get_road_info, name="get_road_info"),
    path("get_user_info/", views.get_user_info, name="get_user_info"),

]