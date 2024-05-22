# 使用官方Redis镜像
FROM redis:7.2.0

# 可选：如果需要自定义配置，添加配置文件
COPY redis.conf /usr/local/etc/redis/redis.conf

# 启动Redis
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]