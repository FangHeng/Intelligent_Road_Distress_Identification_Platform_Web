# 使用Python官方镜像
FROM python:3.10

# 设置工作目录
WORKDIR /

# 复制依赖文件并安装依赖
COPY requirements.txt .
# RUN pip install -r requirements.txt
RUN pip install -r requirements.txt -i https://pypi.mirrors.ustc.edu.cn/simple/


# 复制项目文件
COPY . .

# 检查数据库连接
# 运行Django项目
CMD python wait_for_db.py && python wait_for_redis.py && python manage.py  runserver 0.0.0.0:8000

