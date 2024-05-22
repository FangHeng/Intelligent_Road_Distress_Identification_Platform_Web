# -*- coding: utf-8 -*-
# @Time    : 2023/12/16 00:01
# @Author  : Fang Heng
# @File    : LLM_report.py
# @Software: PyCharm 
# @Comment :

import openai
import json

# 设置API密钥
openai.api_key = 'sk-Leghu1Par0Q2QtGkF0C6C7B4F7Dd40D2Bc5692Fd089bA4Ba'

# 使用方法:
# 输入：resume_text = "您从get_text函数获取的简历文本..."
# 输出：result = analyze_resume(resume_text)，调用模型的第一次输出
# print(result)
def analyze_resume(resume_txt):
    """
    使用OpenAI GPT API解析简历
    返回结构化的数据
    """
    messages = [
        {
            "role": "system",
            "content": "You are a helpful assistant, tasked with structuring provided resumes into a very specific format. Ensure consistent extraction."
        },
        {
            "role": "user",
            "content": f"""Please process the resume. If any information is missing from the resume, set its value to 'None'. The structure MUST be in the following format:

    {{
        "基本信息": {{
            "姓名": "",
            "电话": "",
            "邮箱": "",
            "年龄": "",
            "生日": "",
            "户籍": "",
            "地址": "",
            "性别": "",
            "政治面貌": "",
            "求职意向": "",
            "学历": "",
            "荣誉": [
                "",
                ...
            ],
            "证书": [
                "",
                ...
            ],   
        }},
        "教育经历": [
            {{
                "时间": "",
                "学校": "",
                "专业": ""
            }},
            ...
        ],
        "工作经历": [
            {{
                "时间": "",
                "公司": "",
                "职位": ""
            }},
            ...
        ]
    }}
    IMPORTANT: For all time periods, make sure to use the format '2009.3~2009.08' where the year is followed by a single dot, and then the month (with leading zeros if necessary).
    Here is the resume to process:
    {resume_txt}
    """
        }
    ]

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages
    )

    try:
        # # 尝试解析API的输出为字典格式
        # print(response.choices[0].message['content'])
        parsed_data = json.loads(response.choices[0].message['content'].strip())
    except json.JSONDecodeError:
        return {"error": f"Error parsing resume: {resume_txt}"}

    return parsed_data


if __name__ == '__main__':
    try:
        first_result = analyze_resume("王小二")
        if first_result:
            print("first_result:",first_result)
    except Exception as e:
        print(f"Error in main execution: {e}")