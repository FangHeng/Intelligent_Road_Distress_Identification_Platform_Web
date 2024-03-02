import axios from 'axios';

// 获取 CSRF token
export function getCsrfToken() {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
}

// 创建 axios 实例
const axiosInstance = axios.create({
    // 这里可以设置一些全局的配置，例如 baseURL
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(config => {
    // 在发送请求之前添加 CSRF token
    config.headers['X-CSRFToken'] = getCsrfToken();
    config.headers['Accept'] = 'application/json';

    return config;
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

export default axiosInstance;
