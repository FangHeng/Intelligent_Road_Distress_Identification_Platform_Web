import React, { useState } from 'react';
import { Form, Input, Button, message, Modal } from 'antd';

import { useNavigate } from 'react-router-dom'; //history对象用不了了，现在用Navigate对象
import {UserOutlined, LockOutlined, MailOutlined} from '@ant-design/icons';
import { setCookie } from '../../utils/utils';
import backgroundImage from '../../assets/background.jpg';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // 获取 history 对象
    // 注册模态框
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


    // 登录方法
    const handleSubmit = async (values) => {
        setLoading(true);








        const fetchPromise = fetch('http://127.0.0.1:3001/mongodb/login', {
            method: 'POST',
            body: JSON.stringify({ userid: values.username,password:values.password }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('请求超时，请稍后再试')), 3000)
        );

        try {
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            console.log(response);
            if(response.status===200){
                console.log("登陆成功");
                setLoading(false);
                message.success('登录成功！');
                setCookie('isLogin', btoa('true')) //最简单的加密方式
                setCookie('userId',values.username)
                navigate('/pages/'); // 跳转到导航页面
            }else{
                setLoading(false);
                message.error('登录失败，请检查您的用户名和密码！');
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            message.error('请求超时，请稍后再试');
        }
    };



    return (
        <div style={styles.container}>

            <div style={styles.loginBox}>
                <h1 style={styles.title}>智能道路病害识别平台</h1>

                <Form
                    name="normal_login"


                    initialValues={{ remember: true }}
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="username"
                        style={{marginTop:30}}
                        rules={[{ required: true, message: '请输入您的用户名！' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="用户名" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入您的密码！' }]}
                    >
                        <Input
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="密码"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button

                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                        >
                            登录
                        </Button>
                    </Form.Item>
                </Form>
                <div style={{ textAlign: 'center'}}>
                
                <Button type="link" onClick={showModal}>
                忘记密码？
                </Button>
            </div>
            <Modal
                title="注册"
                open={visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form
                    name="register"
                    initialValues={{ remember: true }}
                    // onFinish={handleRegister} // 处理注册的函数
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: '请输入您的邮箱！' }]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="邮箱" />
                    </Form.Item>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '请输入您的用户名！' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="用户名" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入您的密码！' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="密码" />
                    </Form.Item>
                    {/*<Form.Item*/}
                    {/*    name="captcha"*/}
                    {/*    rules={[{ required: true, message: '请输入验证码！' }]}*/}
                    {/*>*/}
                    {/*    <Input placeholder="验证码" />*/}
                    {/*</Form.Item>*/}
                    {/*<Captcha*/}
                    {/*    charNum={4}*/}
                    {/*    // onChange={handleChange}*/}
                    {/*/>*/}
                </Form>
            </Modal>
            </div>
        </div>
    );
};

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
    // buttonContainer: {
    //     display: 'flex',
    //     justifyContent: 'center',
    //     width: '100%',
    // },
}

export default LoginPage;