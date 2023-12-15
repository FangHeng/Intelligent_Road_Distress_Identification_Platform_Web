# -*- coding: utf-8 -*-
# @Time    : 2023/12/16 00:27
# @Author  : Fang Heng
# @File    : LLM.py
# @Software: PyCharm 
# @Comment :

from openai import OpenAI

client = OpenAI(
    base_url="https://oneapi.xty.app/v1",
    api_key="sk-GkthFvMA4DRMaInHE1B7F0E775A0406fBf8a31E44aF9D267"
)

# 示例：用户输入
road_name = "XYZ街道"
road_location = "城市中心"
damage_rate = "30%"
damage_type = "裂缝"
user_topic = "原因分析"

# 构建 prompt
prompt = f"""
您好，以下是对道路状况的详细分析报告：

道路信息：
- 道路名称：{road_name}
- 位置：{road_location}
- 破损率：{damage_rate}
- 破损类型：{damage_type}

查询主题：{user_topic}
"""

# 根据主题添加相应的分析请求
if user_topic == "总体评价":
    prompt += f"""
    总体评价：
    根据提供的道路状况信息，本报告将对{road_name}的整体状况进行评估。考虑到其破损率为{damage_rate}和破损类型为{damage_type}，以下是对其结构完整性和功能性的综合评价......
    """
elif user_topic == "原因分析":
    prompt += f"""
    原因分析：
    本部分将深入探讨{road_name}出现{damage_type}的主要原因。结合其位置{road_location}和破损率{damage_rate}，以下是对可能的破损成因的详细分析......
    """

# 调用 API
completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are an expert in road damage analysis."},
        {"role": "user", "content": "I need a report about the road condition. Please analyze the following road information, and respond with a report."},
        {"role": "user", "content": prompt}
    ]
)

# 打印回答
print(completion)




# completion = client.chat.completions.create(
#   model="gpt-3.5-turbo",
#   messages=[
#     {"role": "system", "content": "You are a helpful assistant."},
#     {"role": "user", "content": "Hello!"},
#     {"role": "user", "content": "我该如何学习Python编程？"}
#   ]
# )
#
# print(completion)