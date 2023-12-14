// 设置Cookie
// expires是指cookie的过期时间，默认为一小时，path='/'表示为在当前页面下设置一个名为name的Cookie，值为value
export const setCookie = (name, value, path = '/') => {
    const now = new Date();
    const time = now.getTime();
    const expireTime = time + 8 * 60 * 60 * 1000; // 8小时后的时间
    now.setTime(expireTime);
    const expires = 'expires=' + now.toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=${path}`;
};

// 获取Cookie
export const getCookie = (name) => {
    const cookie = document.cookie;
    const prefix = `${name}=`;
    const start = cookie.indexOf(prefix);
    if (start === -1) {
        return null;
    }
    const end = cookie.indexOf(';', start + prefix.length);
    if (end === -1) {
        return cookie.substring(start + prefix.length);
    }
    return cookie.substring(start + prefix.length, end);
};

//删除cookie
export default function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });