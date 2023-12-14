# 使用Python官方镜像
FROM python:3.10

# 设置工作目录
WORKDIR /

# 复制依赖文件并安装依赖
COPY requirements.txt .
RUN pip install -r requirements.txt

# 复制项目文件
COPY . .


# 运行Django应用
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
