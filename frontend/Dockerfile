# 使用Node官方镜像
FROM node:18.19-alpine

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
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# 使用nginx来提供React构建产物
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html