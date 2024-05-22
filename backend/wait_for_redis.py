import time
import redis
import os
import sys

# 获取 Redis 的主机、端口和密码
REDIS_HOST = os.getenv('REDIS_HOST', 'redis')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
REDIS_PASSWORD = os.getenv('REDIS_PASSWORD', None)
print(REDIS_PASSWORD)

# 超时和重试间隔
TIMEOUT = 30  # 总超时时间，秒
INTERVAL = 2  # 每次尝试的间隔时间，秒

# 创建 Redis 连接
def check_redis_connection():
    try:
        # 连接 Redis
        client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASSWORD)
        # 尝试 PING 来确认连接
        client.ping()
        return True
    except redis.exceptions.ConnectionError:
        return False

def wait_for_redis():
    # 等待 Redis 准备就绪
    start_time = time.time()
    while time.time() - start_time < TIMEOUT:
        if check_redis_connection():
            print("Redis connection established！")
            return
        else:
            print("waiting fot Redis...")
            time.sleep(INTERVAL)

    print("timeout, Redis may not really")
    sys.exit(1)  # 超时，退出并返回错误

if __name__ == "__main__":
    wait_for_redis()
