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

]