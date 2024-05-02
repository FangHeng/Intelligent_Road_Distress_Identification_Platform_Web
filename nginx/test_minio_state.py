import os
from minio import Minio
from minio.error import S3Error

# MinIO配置
MINIO_ENDPOINT = 'localhost:9000'
MINIO_ACCESS_KEY = 'MINIOROOT'
MINIO_SECRET_KEY = 'root1234@'
BUCKET_NAME = 'image'

def main():
    # 创建 MinIO 客户端
    minio_client = Minio(
        MINIO_ENDPOINT,
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=False
    )

    # 检查桶是否存在，如果不存在则创建
    try:
        if not minio_client.bucket_exists(BUCKET_NAME):
            minio_client.make_bucket(BUCKET_NAME)
            print(f"Bucket '{BUCKET_NAME}' created.")
        else:
            print(f"Bucket '{BUCKET_NAME}' already exists.")
    except S3Error as e:
        print(f"Error occurred: {e}")

if __name__ == "__main__":
    main()
