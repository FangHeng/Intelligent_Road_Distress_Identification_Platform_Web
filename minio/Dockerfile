# 使用 MinIO 官方镜像作为基础
FROM minio/minio

# 安装 Python 和 MinIO Python 客户端
USER root
#RUN apt-get update && apt-get install -y python3 python3-pip
#RUN pip3 install minio


ENV MINIO_ROOT_USER="MINIOROOT"
ENV MINIO_ROOT_PASSWORD="root1234@"

# 添加脚本到容器
#ADD test_minio_state.py /test_minio_state.py

# 设置启动命令，启动 MinIO
CMD ["minio", "server", "--console-address", ":9001", "/data"]
