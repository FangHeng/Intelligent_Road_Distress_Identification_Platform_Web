from django.test import TestCase

# Create your tests here.
# 引入 MinIO 客户端库
from minio import Minio
from minio.error import S3Error
from django.conf import settings
import os


# 定义 MinIO 服务器的连接参数
MINIO_ENDPOINT = 'minio:9000'  # 使用服务名而不是IP地址
MINIO_ACCESS_KEY = 'MINIOROOT'  # 修改为你的访问键
MINIO_SECRET_KEY = 'root1234@'  # 修改为你的密钥
MINIO_USE_HTTPS = False  # 根据你的 MinIO 服务器是否启用 HTTPS 修改


def test_minio_connection():
    # 初始化 MinIO 客户端
    minio_client = Minio(
        MINIO_ENDPOINT,
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=MINIO_USE_HTTPS
    )

    try:
        # 尝试列出所有桶
        buckets = minio_client.list_buckets()
        print("Connection Successful!")
        print("List of buckets:")
        for bucket in buckets:
            print(bucket.name)
    except S3Error as e:
        print(f"Connection Failed: {e}")

if __name__ == "__main__":
    test_minio_connection()