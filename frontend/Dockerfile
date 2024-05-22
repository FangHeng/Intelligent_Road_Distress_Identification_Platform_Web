# 使用Node官方镜像作为构建环境
FROM node:18.19-alpine as build

# 设置工作目录
WORKDIR /app

# 复制npm配置文件
COPY package*.json ./

# 设置npm源
RUN npm config set registry https://registry.npmmirror.com

# 安装依赖
RUN npm install

# 复制项目文件并构建应用
COPY . .

# # 将.env文件复制到前端应用的根目录
# COPY ../.env .env

RUN npm run build

# 使用nginx来提供React构建产物
FROM nginx:alpine

# 将构建结果复制到nginx目录下
COPY --from=build /app/build /usr/share/nginx/html

# 复制证书文件到nginx目录下
COPY ssl/irdip.com.cn.crt /etc/nginx/ssl/irdip.com.cn.crt
COPY ssl/irdip.com.cn.key /etc/nginx/ssl/irdip.com.cn.key

# 复制nginx配置文件，以自定义nginx行为
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 443
EXPOSE 80

# 启动Nginx，保持前台运行
CMD ["nginx", "-g", "daemon off;"]

