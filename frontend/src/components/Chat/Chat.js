// Chat.js
import React from 'react';
import {ProChat } from '@ant-design/pro-chat';
import {ThemeProvider, useTheme} from 'antd-style';
import UserAvatar from '../../assets/img/Male.png'
import GPTAvatar from '../../assets/img/logo/logo-mini.png'
import chatStore from "../../store/ChatStore";
import {themeStore} from "../../store/ThemeStore";
import userStore from "../../store/UserStore";
import {observer} from "mobx-react-lite";

const Chat = observer(() => {
    const theme = useTheme();

    const userTheme = themeStore.theme === 'dark' ? 'dark' : 'light';
    const userInfo = userStore.userInfo;

    const [chats, setChats] = React.useState([]);


    // const handleRequest = async (messages) => {
    //     const PickMessages = messages.map((message) => {
    //         return {
    //             role: message.role,
    //             content: message.content,
    //         };
    //     });
    //     try {
    //
    //
    //         // 等待sendMessage处理完成，并接收返回的数据
    //         // const completion = await chatStore.sendMessage(chatStore.messages);
    //         const completion = '这是一个测试消息'
    //         // 返回符合ProChat组件预期的格式
    //         return new Response(completion);
    //     } catch (error) {
    //         console.error('Error in handleRequest:', error);
    //         return [{role: 'system', content: `Response error, status: ${error.toString()}`}]; // 确保错误信息是字符串
    //     }
    // };
    const handleRequest = async (messages) => {
        // 从chatStore获取先验知识
        const priorKnowledge = chatStore.messages[0]; // 假设先验知识总是存储在第一个位置

        // 构造新的消息数组，先加入先验知识，然后添加其余的消息
        const updatedMessages = [priorKnowledge, ...messages.map((message) => ({
            role: message.role,
            content: message.content,
        }))];

        console.log('updatedMessages', updatedMessages)

        try {
            // 更新chatStore中的消息
            chatStore.setMessages(updatedMessages);

            // 调用chatStore的sendMessage方法，将处理过的消息发送出去
            const completion = await chatStore.sendMessage(updatedMessages);
            // const completion = '这是一个测试消息'; // 用于测试的静态消息

            console.log(chatStore.messages)
            // 返回符合ProChat组件预期的格式
            return new Response(completion);
        } catch (error) {
            console.error('Error in handleRequest:', error);
            return [{role: 'system', content: `Response error, status: ${error.toString()}`}]; // 确保错误信息是字符串
        }
    };

    return (

            <ThemeProvider
                appearance={userTheme}
                // theme={{
                //     token: {
                //         colorPrimary: '#ED4192',
                //         colorText: '#1890ff',
                //     },
                // }}
            >
                <div style={{
                    backgroundColor: theme.colorBgLayout,
                    margin: -24,
                }}
                >
                    <ProChat
                        style={{
                            // 自动计算高度
                            height: 'calc(100vh - 60px)',
                        }}
                        showTitle
                        userMeta={{
                            avatar: userInfo.avatar || UserAvatar,
                            title: userInfo.username,
                        }}
                        assistantMeta={{avatar: GPTAvatar, title: '纹影探路'}}
                        helloMessage={
                            '我是纹影探路，请问可以帮助你什么？😊'
                        }
                        autocompleteRequest={async (value) => {
                            if (value === '/') {
                                return [
                                    {
                                        value: '帮我总结此次检测结果？',
                                        label: '帮我总结此次检测结果？'
                                    },
                                    {
                                        value: '对应的维修建议是怎样的？',
                                        label: '对应的维修建议是怎样的？'
                                    }
                                ];
                            }
                            return [];
                        }}
                        placeholder="输入 / 查看推荐问题，或者直接输入你的问题"
                        request={handleRequest}
                        chats={chats}
                        onChatsChange={(updatedChats) => {
                            setChats(updatedChats); // 更新本地状态
                        }}

                    />
                </div>

            </ThemeProvider>

    );
});

export default Chat;