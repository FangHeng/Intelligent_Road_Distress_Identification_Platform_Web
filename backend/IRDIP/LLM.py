# -*- coding: utf-8 -*-
# @Time    : 2023/12/16 00:27
# @Author  : Fang Heng
# @File    : LLM.py
# @Software: PyCharm 
# @Comment :

import re
import json
from openai import OpenAI
from pprint import pprint

""" 
这里生成的是一个全局的client，可以在其他地方直接调用
我使用的是一个中转的ChatGPT模型
注释部分提供了一个OpenAI官方的GPT模型，但是需要自己申请API密钥
官方网址：https://platform.openai.com/account/api-keys
"""
client = OpenAI(
    base_url="https://oneapi.xty.app/v1",
    api_key="sk-GkthFvMA4DRMaInHE1B7F0E775A0406fBf8a31E44aF9D267"
)

# client = OpenAI(
#     base_url="https://api.openai.com/v1",
#     api_key="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"
# )


def produce_report(prior_information=None):
    # 调用 API
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an expert in road damage analysis and are expected to provide responses in a professional, objective, and structured report format."},
            {"role": "user", "content": "I need a chinese report about the road condition. Please analyze the following road information in detail, and respond with a report in a structured format. Your response should be in the form of a list of dictionaries, with each dictionary containing a 'theme' and its corresponding 'answer'."},
            {"role": "user", "content": """
                        总体评价：请对一条城市道路的整体状况进行综合评价。考虑道路的使用频率、地理位置、重要性，以及对周边社区的影响。评价应包括对路面平整度、交通流量、以及道路对城市交通网络的重要性的考虑。同时，考虑到道路的历史维护记录和当前的使用情况。
                        路面状况：详细分析一条城市主干道的路面状况。包括路面材料的类型、路面老化程度、裂缝、坑洞、积水或排水问题的存在。描述路面标记的清晰度和可见性，以及路面对不同天气条件下的抗滑性能。提供对路面状况对车辆行驶的影响的评价，包括潜在的磨损和损害情况。
                        环境因素：分析影响该道路状况的环境因素。包括气候条件（如温度变化、降雨、雪），以及这些因素如何影响路面材料和结构。讨论周围植被、树木根系对道路结构的可能影响。考虑周边建筑和工业活动对道路的影响，例如重型车辆使用和化学物质的潜在渗漏。
                        安全性评估：对该道路的安全性能进行全面评估。考虑路面状况、交通标志和信号灯的可见性和有效性。评价道路设计（如弯道、交叉口）对交通安全的影响，以及路面状况对紧急情况下车辆操控的影响。分析过往交通事故记录，识别潜在的高风险区域，并提出改善建议。
                        维修建议：基于以上分析，提出具体的道路维修和改善建议。包括紧急修补（如坑洞填补）、长期维护计划（如重新铺设路面）、路面标记的重新绘制。考虑使用更耐用或环保的材料，以及改善排水系统的方法。建议应基于安全性、成本效益和对交通流量的最小干扰。
                        """},
            {"role": "user", "content": "道路名称：长江大道"},
        ]
    )

    message = completion.choices[0].message.content
    return message


def format_report(prior_information=None, max_attempts=5):
    attempt = 0
    while attempt < max_attempts:
        try:
            message = produce_report()
            message = extract_message(message)
            # print(message)
            if message is None:
                print("无法解析返回的消息。正在重试...")
                continue
            # 尝试解析返回的消息为JSON格式
            road_condition_report = json.loads('\n'.join(message.split('\n')[1:-1]))
            return road_condition_report
        except json.JSONDecodeError as e:
            # print(message)
            print(f"JSON解析错误：{e}. 正在重试...（尝试次数 {attempt + 1}/{max_attempts}）")
            attempt += 1
        except Exception as e:
            print(f"发生异常：{e}. 无法继续尝试。")
            break

    print("在最大尝试次数内无法解析返回的消息")
    return None


def extract_message(content):
    # 正则表达式匹配 ``` 开始到 ``` 结束之间的内容
    pattern = r'```(.*?)```'
    match = re.search(pattern, content, re.DOTALL)

    if match:
        # 匹配成功，返回包含 ``` 的内容
        return '```' + match.group(1) + '```'
    else:
        # 没有匹配到内容
        return None


if __name__ == '__main__':
    # message = produce_report()
    #
    # print(message)
    # pprint(type(message))
    #
    # # road_condition_report = json.loads(message)
    # road_condition_report = json.loads('\n'.join(message.split('\n')[1:-1]))
    # pprint(road_condition_report)
    # for item in road_condition_report:
    #     print(f"主题: {item['theme']}, 回答: {item['answer']}")

    road_condition_report = format_report(prior_information=None)
    pprint(road_condition_report)