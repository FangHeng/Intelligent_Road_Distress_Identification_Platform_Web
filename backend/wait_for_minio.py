import os
from minio import Minio
from minio.error import S3Error

# MinIO配置
# MINIO_ENDPOINT = 'minio:9000'
# MINIO_ACCESS_KEY = 'MINIOROOT'
# MINIO_SECRET_KEY = 'root1234@'
BUCKET_NAME = 'image'
UPLOAD_DIR = './uploads'  # 上传目录

# todo: change hard code mode
def main():

    client = Minio(
        # endpoint=os.environ.get('MINIO_ENDPOINT','minio:9000'),
        # os.getenv('MINIO_ENDPOINT'),
        '10.234.114.29:9000',
        # access_key=os.environ.get('MINIO_ROOT_USER'),
        # secret_key=os.environ.get('MINIO_ROOT_PASSWORD'),
        access_key='MINIOROOT',
        secret_key='root1234@',
        secure=False
    )

    bucket_name = BUCKET_NAME
    if not client.bucket_exists(bucket_name):
        client.make_bucket(bucket_name)

    local_folder = UPLOAD_DIR
    for root, _, files in os.walk(local_folder):
        for file_name in files:
            local_path = os.path.join(root, file_name)
            remote_path = 'uploads/'+os.path.relpath(local_path, local_folder) #目录位置是单个构建的
            stat_info = os.stat(local_path)
            try:
                obj = client.stat_object(bucket_name, remote_path)
                # Only upload if the local file is newer
                if int(stat_info.st_mtime) > int(obj.last_modified.timestamp()):
                    client.fput_object(bucket_name, remote_path, local_path)
                    print(f"Updated '{remote_path}'")
            except S3Error as e:
                if e.code == "NoSuchKey":
                    client.fput_object(bucket_name, remote_path, local_path)
                    print(f"Uploaded '{remote_path}'")
                else:
                    print(f"Failed to upload '{remote_path}': {e}")
    print("minio is ready ! ")

if __name__ == "__main__":
    main()
