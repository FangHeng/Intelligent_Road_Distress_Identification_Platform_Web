import React, {useEffect, useState} from 'react';
import {Form, Input, Button, message, Modal, Select, AutoComplete, Row, Col} from 'antd';
import { useNavigate } from 'react-router-dom';
import {UserOutlined, LockOutlined, MailOutlined, SafetyOutlined} from '@ant-design/icons';
import backgroundImage from '../../assets/img/background.jpg';
import userStore from '../../store/UserStore'
import { observer } from 'mobx-react-lite'
import uiStore from "../../store/UIStore";
import companyStore from "../../store/CompanyStore";
import axiosInstance from "../../utils/AxiosInstance";
import {checkComplexity} from "../../utils/utils";

const Login = observer(() => {
    useEffect(() => {
        companyStore.fetchCompanies(); // 获取公司列表
    }, []);

    const navigate = useNavigate(); // 获取 history 对象

    const [jobNumber, setJobNumber] = useState('');
    const [password, setPassword] = useState('');
    const [company, setCompany] = useState('');

    // 忘记密码模态框
    const [visible, setVisible] = useState(false);
    const [options, setOptions] = useState([]);

    const handleSearch = (value) => {
        let res = [];
        if (!value || value.indexOf('@') >= 0) {
            res = [];
        } else {
            res = ['gmail.com', '163.com', 'qq.com', 'outlook.com'].map((domain) => ({
                value: `${value}@${domain}`, // 确保这里的 value 包含了完整的邮箱地址
            }));
        }
        setOptions(res);
    };

    const showModal = () => {
        setVisible(true);
    };

    // const handleOk = e => {
    //     console.log(e);
    //     setVisible(false);
    // };
    //
    const handleCancel = e => {
        console.log(e);
        setVisible(false);
    };

    const handleLogin = async () => {
        uiStore.startLoading();
        await userStore.login(company, jobNumber, password);
        if (userStore.isLoggedIn) {
            navigate('/pages/home');
        }
        else {
            uiStore.stopLoading();
            message.error(userStore.loginHint.message);
        }
    };

    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const [resetPasswordForm] = Form.useForm();

    // 发送验证码
    const sendVerificationCode = async () => {
        setLoading(true);
        try {
            // 创建 FormData 对象
            let formData = new FormData();
            // 从表单中获取电子邮件地址
            const { email } = resetPasswordForm.getFieldsValue(['email']);
            if (!email) {
                message.error('请先输入电子邮件地址！');
                return;
            }

            formData.append('email', email); // 添加电子邮件地址到表单数据
            // 打印表单数据，用于调试
            for (let [key, value] of formData.entries()) {
                console.log(key + ':', value);
            }
            // 发送请求
            const response = await axiosInstance.post('/irdip/send_email_verification/', formData);

            // 根据响应处理逻辑
            if (response.data.status === 'success') {
                message.success('验证码已发送！');
                setCountdown(60);
                let timer = setInterval(() => {
                    setCountdown((prevCountdown) => {
                        if (prevCountdown <= 1) clearInterval(timer);
                        return prevCountdown - 1;
                    });
                }, 1000);
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message || '发送验证码时发生错误！';
                message.error(errorMessage);
            } else {
                message.error('无法连接到服务器，请检查您的网络连接或稍后重试！');
            }
        }
        setLoading(false);
    };

    const handleResetPassword = async (values) => {
        try {
            // 创建一个 FormData 对象
            let formData = new FormData();
            formData.append('email', values.email);
            formData.append('code', values.verificationCode);
            formData.append('new_password', values.password);

            // 打印formData
            for (let [key, value] of formData.entries()) {
                console.log(key + ':', value);
            }

            // 发送 POST 请求
            const response = await axiosInstance.post('/irdip/change_password_with_email_verification/', formData);

            // 根据后端返回的状态码处理逻辑
            if (response.status === 200) {
                message.success('密码更新成功！');
                // setVisible(false);
                // 重置表单
                resetPasswordForm.resetFields();
            }
        } catch (error) {
            if (error.response) {
                // 从后端响应中提取错误消息
                switch (error.response.status) {
                    case 400:
                        message.error('无效的验证码！');
                        break;
                    case 404:
                        message.error('邮箱未注册！');
                        break;
                    case 405:
                        message.error('无效的请求方法！');
                        break;
                    default:
                        message.error('更新密码时发生错误！');
                }
            } else {
                // 处理无法连接到服务器的情况
                message.error('无法连接到服务器，请检查您的网络连接！');
            }
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
                        name="company"
                        rules={[{ required: true, message: '请选择公司！' }]}
                    >
                        <Select
                            style={{ marginTop: 30, width: '100%' }}
                            placeholder="选择公司"
                            onChange={(value) => setCompany(value)}
                        >
                            {companyStore.companyOptions.map(company => (
                                <Select.Option key={company.id} value={company.id}>
                                    {company.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="jobNumber"
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
                    onCancel={handleCancel}
                    footer={null}
                    style={{ top: '25%' }} // 控制 Modal 在垂直方向上的位置
                >
                    <Form
                        name="resetPassword"
                        initialValues={{remember: true}}
                        form={resetPasswordForm}
                        onFinish={handleResetPassword}
                    >
                        {/*对邮箱使用autocomplete*/}
                        <Form.Item
                            name="email"
                            rules={[{required: true, message: '请输入您的邮箱！'}]}
                        >
                        <AutoComplete
                            options={options}
                            onSearch={handleSearch}
                            onSelect={value => console.log("Selected:", value)}
                        >
                            <Input prefix={<MailOutlined />} placeholder="邮箱" />
                        </AutoComplete>
                        </Form.Item>
                        <Form.Item
                            name="jobNumber"
                            rules={[{required: true, message: '请输入您的工号！'}]}
                        >
                            <Input prefix={<UserOutlined/>} placeholder="工号"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {required: true, message: '请输入您的密码！'},
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        if (!value || !checkComplexity(value)) {
                                            return Promise.reject(new Error('密码过于简单，请包含大写字母、数字和特殊字符'));
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}

                        >
                            <Input
                                prefix={<LockOutlined/>}
                                type="password"
                                placeholder="密码"
                            />

                        </Form.Item>
                        <Row gutter={8}> {/* 添加间隔 */}
                            {/* 验证码输入框 */}
                            <Col span={18}> {/* 调整所占列数以调整宽度 */}
                                <Form.Item
                                    name="verificationCode"
                                    rules={[{ required: true, message: '请输入验证码！' }]}
                                >
                                    <Input
                                        prefix={<SafetyOutlined />} // 添加验证码图标
                                        placeholder="验证码"
                                    />
                                </Form.Item>
                            </Col>
                            {/* 发送验证码按钮 */}
                            <Col span={6}> {/* 调整所占列数以调整宽度 */}
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        block
                                        loading={loading}
                                        disabled={countdown > 0}
                                        onClick={sendVerificationCode}
                                    >
                                        {countdown > 0 ? `${countdown}秒后重试` : '发送验证码'}
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                        {/* 提交按钮 */}
                        <Form.Item style={{ textAlign: 'center' }}>
                            <Button type="primary" htmlType="submit" style={{ width: '50%', margin: '0 auto' }}>
                                重置密码
                            </Button>
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