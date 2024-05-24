# 使用Python官方镜像
FROM python:3.10

# # 使用 PyTorch 官方镜像
# FROM pytorch/pytorch:2.0.1-cuda11.7-cudnn8-runtime

# 设置工作目录
WORKDIR /

# 复制依赖文件并安装依赖
COPY requirements.txt .

# # 安装系统依赖
# RUN apt-get update && \
#     apt-get install -y gcc pkg-config libmysqlclient-dev && \
#     rm -rf /var/lib/apt/lists/*
    
# RUN pip install -r requirements.txt
RUN pip install -r requirements.txt -i https://pypi.mirrors.ustc.edu.cn/simple/


# 复制项目文件
COPY . .

# 检查数据库、缓存、文件服务器连接
# 运行Django项目
CMD python wait_for_db.py && python wait_for_redis.py && python wait_for_minio.py && python manage.py  runserver 0.0.0.0:8000