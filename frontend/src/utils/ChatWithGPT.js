require('dotenv').config();
const OpenAI = require('openai').default;
console.log(process.env.OPENAI_API_KEY)

const openai = new OpenAI({
    apiKey: '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', // This is the default and can be omitted
});

async function chatWithGPT() {
    try {
        const stream = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'Say this is a test' }],
            stream: true,
        });
        for await (const chunk of stream) {
            console.log(chunk.choices[0]?.delta?.content || '');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

chatWithGPT();

// const axios = require('axios');
// let data = JSON.stringify({
//     "modelStructure": "gpt-3.5-turbo",
//     "messages": [
//         {
//             "role": "user",
//             "content": "Say this is a test!"
//         }
//     ],
//     "temperature": 0.7
// });
//
// let config = {
//     method: 'post',
//     maxBodyLength: Infinity,
//     url: 'https://oneapi.xty.app/v1/chat/completions',
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer sk-GkthFvMA4DRMaInHE1B7F0E775A0406fBf8a31E44aF9D267',
//         'Cookie': '__cf_bm=qE51RYZ7CgV.VcG9o2scNfqqXer85L2grVWtlHy05so-1703404052-1-ARtG6xqR/5mSqL+aN/uNrQBSXciGW1qxMo99pBIdkFIKXW+GxAGhbKOfEtoMzfaH9lMiDahLeko6Lz/CwkDGubE=; _cfuvid=SyHWlE9zkGPy1b1StkndcAMqkGLo7o4IOfxJD_gmEBo-1703404052699-0-604800000'
//     },
//     data : data
// };
//
// axios.request(config)
//     .then((response) => {
//         console.log(JSON.stringify(response.data));
//     })
//     .catch((error) => {
//         console.log(error);
//     });

// const axios = require('axios');
//
// function chatWithGPT(userMessage) {
//     let data = JSON.stringify({
//         "modelStructure": "gpt-3.5-turbo",
//         "messages": [
//             {
//                 "role": "user",
//                 "content": userMessage
//             }
//         ],
//         "temperature": 0.7
//     });
//
//     let config = {
//         method: 'post',
//         maxBodyLength: Infinity,
//         url: 'https://oneapi.xty.app/v1/chat/completions',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer sk-GkthFvMA4DRMaInHE1B7F0E775A0406fBf8a31E44aF9D267', // 替换为您的 API 密钥
//             // 注意：移除了 Cookie 头，因为它通常不是 API 请求的必需部分
//         },
//         data: data
//     };
//
//     return axios.request(config)
//         .then((response) => response.data)
//         .catch((error) => {
//             console.error(error);
//             throw error; // 可以根据需要决定是否要抛出错误
//         });
// }
//
// // export default chatWithGPT;
//
// // 使用示例
// chatWithGPT("Say this is a test!")
//     .then(response => console.log(JSON.stringify(response)))
//     .catch(error => console.error('Error:', error));
