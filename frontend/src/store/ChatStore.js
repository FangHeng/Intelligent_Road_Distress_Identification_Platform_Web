import { makeAutoObservable } from "mobx";
import axios from "axios";

class ChatStore {
    messages = [
        { role: 'gpt', content: '你好，我是纹影探路，你的智能道路分析帮手。' },
    ];
    isSending = false;

    constructor() {
        makeAutoObservable(this);
    }

    addMessage(role, content) {
        this.messages.push({ role, content });
    }

    getMessages() {
        return this.messages;
    }

    setIsSending(isSending) {
        this.isSending = isSending;
    }

    sendMessage(messages) {
        this.setIsSending(true);
        const formattedMessages = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        const jsonMessages = JSON.stringify(formattedMessages);
        chatWithGPT(jsonMessages)
            .then(responseData => {
                const completion = responseData.choices[0].message.content;
                this.addMessage('gpt', completion); // 使用正确提取的内容
                console.log('completion', responseData)
                this.setIsSending(false);
            })
            .catch(error => {
                console.error('Error in sendMessage:', error);
                this.setIsSending(false);
            });
    }

}

function chatWithGPT(userMessage) {
    let data = JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [
            {
                "role": "user",
                "content": userMessage
            }
        ],
        "temperature": 0.7
    });
    console.log(userMessage, data)
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://oneapi.xty.app/v1/chat/completions',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sk-GkthFvMA4DRMaInHE1B7F0E775A0406fBf8a31E44aF9D267', // 替换为您的 API 密钥
            // 注意：移除了 Cookie 头，因为它通常不是 API 请求的必需部分
        },
        data: data
    };
    console.log(config)

    return axios.request(config)
        .then((response) => response.data)
        .catch((error) => {
            console.error(error);
            throw error; // 可以根据需要决定是否要抛出错误
        });
}


const chatStore = new ChatStore();
export default chatStore;
