# 使用Node官方镜像
FROM node:18.19-alpine

# 设置工作目录
WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install

# 复制项目文件并构建应用
COPY . .
RUN npm run build

# 使用nginx来提供React构建产物
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
