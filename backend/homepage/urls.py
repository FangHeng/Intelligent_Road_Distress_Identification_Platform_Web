# -*- coding: utf-8 -*-
# @Time    : 2023/12/15 02:29
# @Author  : Fang Heng
# @File    : urls.py
# @Software: PyCharm 
# @Comment :

from django.contrib import admin
from django.urls import path, include
from homepage import views

app_name = 'homepage'

urlpatterns = [
    path("", views.index, name="index"),

]

