import {action, makeAutoObservable, observable, toJS} from "mobx";
import axios from "axios";


class ChatStore {
    messages = [
        { role: 'gpt', content: '你好，我是纹影探路，你的智能道路分析帮手。' },
    ];
    isSending = false;

    constructor() {
        makeAutoObservable(this, {
            messages: observable,
            isSending: observable,
            addMessage: action,
            sendMessage: action,
            setIsSending: action,
            updateAnalysisResult: action,
        });
    }

    addMessage(role, content) {
        this.messages.push({ role, content });
    }

    getMessages() {
        return this.messages;
    }

    formatMessages(analysisResult) {
        // 使用 toJS 将其转换为普通的 JavaScript 数组
        const analysisMessageContent = toJS(analysisResult);

        // 现在可以使用 map 函数
        return analysisMessageContent.map(item => {
            const roadName = item.typeName; // 道路名称加上传名称以加区别
            const classification = item.classification; // 分类
            const percentage = item.percentage; // 占比

            return `${roadName}，${classification}，占比：${(percentage * 100).toFixed(2)}%`;
        }).join('\n')
    }

    // ChatStore 中
    updateAnalysisResult(newAnalysisResult) {
        this.analysisResult = newAnalysisResult;
        const formattedMessage = this.formatMessages(newAnalysisResult);
        const analysisIntro = "在本次对话中你的角色是gpt，这是一条或几条道路的一个分析检测结果，每条是该道路本次检测后的病害分类结果的占比，请你参考这次的检测结果（即作为道路的最新监测情况），我的问题将会围绕这次检测结果（即该道路的情况）问你相关道路情况和维修问题：";
        const fullAnalysisMessage = `${analysisIntro}\n${formattedMessage}`;
        // 判断messages中是否已经有了分析结果，如果有了，就替换成新的分析结果
        const analysisMessageIndex = this.messages.findIndex(msg => msg.role === 'analysis');
        if (analysisMessageIndex !== -1) {
            this.messages[analysisMessageIndex].content = fullAnalysisMessage;
        } else {
            this.addMessage('analysis', fullAnalysisMessage);
        }
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
        console.log('jsonMessages', jsonMessages)
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
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY }`,
        },
        data: data
    };

    return axios.request(config)
        .then((response) => response.data)
        .catch((error) => {
            console.error(error);
            throw error; // 可以根据需要决定是否要抛出错误
        });
}


const chatStore = new ChatStore();
export default chatStore;
