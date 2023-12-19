// utils.js
//获取cookie token
export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


// 获取图片base64编码
export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });


// 封装fetch函数，添加CSRF token
export const fetchWithToken = async (url, options = {}) => {
    const csrfToken = getCookie('csrftoken'); // 从cookie中获取CSRF token

    // 合并headers，确保不会覆盖options中已有的headers
    const headers = {
        'Accept': 'application/json',
        'X-CSRFToken': csrfToken,
        ...options.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    return response;
};

