import {action, makeAutoObservable, observable, toJS} from "mobx";

class ChatStore {
    messages = [
        {
            role: 'system',
            content: '你是纹影探路，一个路面病害分析的专家。'
        }
    ];

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

    setMessages(messages) {
        this.messages = messages;
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

    updateAnalysisResult(newAnalysisResult) {
        const formattedMessage = this.formatMessages(newAnalysisResult);
        const analysisIntro = "你是纹影探路，一个路面病害分析的专家。这是本次对话的一个先验知识，是一条或几条道路的一个分析检测结果，每条是该道路本次检测后的病害分类结果的占比，请你参考这次的检测结果（即作为道路的最新监测情况），用户的问题将会围绕这次检测结果（即该道路的情况）问你相关道路情况和维修问题：";
        const fullAnalysisMessage = `${analysisIntro}\n${formattedMessage}`;
        // 判断messages中是否已经有了分析结果，如果有了，就替换成新的分析结果
        const analysisMessageIndex = this.messages.findIndex(msg => msg.role === 'system');
        if (analysisMessageIndex !== -1) {
            this.messages[analysisMessageIndex].content = fullAnalysisMessage;
        } else {
            this.addMessage('system', fullAnalysisMessage);
        }
    }

    sendMessage(messages) {
        return new Promise((resolve, reject) => {
            const formattedMessages = messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            console.log('formattedMessages:', formattedMessages)

            chatWithGPT(formattedMessages) // 确保这个函数返回一个Promise且处理的是对象而不是字符串，如果需要的话
                .then(responseData => {
                    const completion = responseData.choices[0].message.content;
                    this.addMessage('assistant', completion);
                    resolve(completion); // 解析Promise，返回完成文本
                })
                .catch(error => {
                    console.error('Error in sendMessage:', error);
                    reject('Sorry, something went wrong.'); // 拒绝Promise，返回错误信息
                });
        });
    }

}

// function chatWithGPT(userMessage) {
//     let data = JSON.stringify({
//         "model": "gpt-3.5-turbo",
//         "messages": [
//             {
//                 "role": "user",
//                 "content": userMessage
//             }
//         ],
//         "temperature": 0.7
//     });
//     console.log(userMessage, data)
//     let config = {
//         method: 'post',
//         maxBodyLength: Infinity,
//         url: 'https://oneapi.xty.app/v1/chat/completions',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY }`,
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
function chatWithGPT(message) {
    // 设置一个随机的temperature值【0。8，1.0】
    let temperature = Math.random() * 0.2 + 0.8;

    let data = JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": message,
        "temperature": temperature,
    });

    return fetch('https://oneapi.xty.app/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY }`
        },
        body: data
    })
        .then((response) => {
            if (!response.ok) { // 检查响应状态
                throw new Error('Network response was not ok');
            }
            return response.json(); // 解析JSON数据
        })
        .catch((error) => {
            console.error('Error in chatWithGPT:', error);
            throw error; // 根据需要决定是否要抛出错误
        });
}


const chatStore = new ChatStore();
export default chatStore;
