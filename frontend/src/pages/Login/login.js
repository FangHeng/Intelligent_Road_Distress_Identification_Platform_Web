import React, { useState } from 'react';
import { Form, Input, Button, message, Modal } from 'antd';

import { useNavigate } from 'react-router-dom'; //history对象用不了了，现在用Navigate对象
import {UserOutlined, LockOutlined, MailOutlined} from '@ant-design/icons';
import { setCookie } from '../../utils/utils';
import backgroundImage from '../../assets/background.jpg';
import {userStore} from '../../store/userStore'
import { observer } from 'mobx-react-lite'

const Login = observer(() => {
    const navigate = useNavigate(); // 获取 history 对象

    const [jobNumber, setJobNumber] = useState('');
    const [password, setPassword] = useState('');

    // 忘记密码模态框
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = e => {
        console.log(e);
        setVisible(false);
    };

    const handleCancel = e => {
        console.log(e);
        setVisible(false);
    };

    const handleLogin = async () => {
        await userStore.login(jobNumber, password);
        if (userStore.isLoggedIn) {
            navigate('/pages');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <h1 style={styles.title}>智能道路病害识别平台</h1>

                <Form
                    name="normal_login"
                    onFinish={handleLogin}
                >
                    <Form.Item
                        name="jobNumber"
                        style={{marginTop: 30}}
                        rules={[{required: true, message: '请输入您的工号！'}]}
                    >
                        <Input prefix={<UserOutlined/>} placeholder="工号" value={jobNumber} onChange={(e) => setJobNumber(e.target.value)}/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: '请输入您的密码！'}]}
                    >
                        <Input
                            prefix={<LockOutlined/>}
                            type="password"
                            placeholder="密码"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={userStore.isLoading} // 控制按钮加载状态
                        >
                            登录
                        </Button>
                        {userStore.loginError && (
                            message.error(userStore.loginError)
                        )}
                    </Form.Item>
                </Form>
                <div style={{textAlign: 'center'}}>

                    <Button type="link" onClick={showModal}>
                        忘记密码？
                    </Button>
                </div>
                <Modal
                    title="重置密码"
                    open={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <Form
                        name="resetPassword"
                        initialValues={{remember: true}}
                        // onFinish={handleRegister} // 处理注册的函数
                    >
                        <Form.Item
                            name="email"
                            rules={[{required: true, message: '请输入您的邮箱！'}]}
                        >
                            <Input prefix={<MailOutlined/>} placeholder="邮箱"/>
                        </Form.Item>
                        <Form.Item
                            name="jobNumber"
                            rules={[{required: true, message: '请输入您的工号！'}]}
                        >
                            <Input prefix={<UserOutlined/>} placeholder="工号"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{required: true, message: '请输入您的密码！'}]}
                        >
                            <Input.Password prefix={<LockOutlined/>} placeholder="密码"/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
})


const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundColor: '#f0f2f5',
    },
    loginBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // 设置背景色为白色，透明度为0.8
        borderRadius: '5px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '350px', // 设置登录框宽度为400px

        maxWidth: '90%', // 确保登录框不会超过其父元素的90%
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        fontWeight: 'bold',
        fontSize: '24px',
    },
}

export default Login;