// import OpenAI from "openai";

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

// 密码复杂度检查函数
export const checkComplexity = (password) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasUpper = /[A-Z]/;
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    return password.length >= minLength && hasNumber.test(password) && hasUpper.test(password) && hasSpecialChar.test(password);
};

export const classification_mapping = {
    0: "胶结裂隙",
    1: "裂纹",
    2: "纵向裂纹",
    3: "松散",
    4: "大裂缝",
    5: "修补",
    6: "正常",
    7: "横向裂纹"
};

export const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    // 使用 toLocaleString 方法格式化日期时间
    // 您可以根据需要更改 'zh-CN' 为其他区域设置
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // 使用24小时制
    });
}

export const maskString = (str, visibleStart = 3, visibleEnd = 4) => {
    if (str == null) { // 检查 null 或 undefined
        return '';
    }

    // 如果字符串足够长，则遮盖中间部分
    if (str.length > visibleStart + visibleEnd) {
        const regex = new RegExp(`^(.{${visibleStart}})(.*)(.{${visibleEnd}})$`);
        return str.replace(regex, (match, start, middle, end) => {
            const maskedMiddle = '*'.repeat(middle.length);
            return `${start}${maskedMiddle}${end}`;
        });
    }

    // 如果字符串不够长，就返回原字符串
    return str;
};


// 使用您的 API key 创建 OpenAI 实例
// const openai = new OpenAI("sk-GkthFvMA4DRMaInHE1B7F0E775A0406fBf8a31E44aF9D267");
//
// async function chatWithGPT() {
//     const stream = await openai.chat.completions.create({
//         modelStructure: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: "Say this is a test" }],
//         stream: true,
//     });
//     for await (const chunk of stream) {
//         process.stdout.write(chunk.choices[0]?.delta?.content || "");
//     }
// }

