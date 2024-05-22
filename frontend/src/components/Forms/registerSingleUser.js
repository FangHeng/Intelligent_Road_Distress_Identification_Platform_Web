// RegisterSingleUser.js: 注册单个用户
import {Alert, App, Button, Card, Form, Input} from "antd";
import React, {useEffect} from "react";
import userStore from "../../store/UserStore";
import {observer} from "mobx-react-lite";
import companyStore from "../../store/CompanyStore";
import {checkComplexity} from "../../utils/utils";
import axiosInstance from "../../utils/AxiosInstance";


const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

export const RegisterSingleUser = observer(() =>{
    const {user_level} = userStore.userInfo;
    const numberCode = companyStore.employeeNumber;
    const {message} = App.useApp();
    const [registerSingleUser] = Form.useForm();

        useEffect(() => {
            if (numberCode === 0) {
                const fetchEmployeeNumber = async () => {
                    await companyStore.fetchEmployeeNumber();
                }

                fetchEmployeeNumber().catch((error) => {
                    message.error('获取员工工号长度失败！');
                });
            }

        }, []);

    const onFinish = async (values) => {
        // 构建要发送的数据
        const formData = new FormData();
        formData.append('employee_number', values.jobnumber);
        formData.append('password', values.password);


        try {
            const response = await axiosInstance.post('/irdip/register_subordinate/', formData);
            if (response.data.status === 'success') {
                await userStore.fetchSubordinatesInfo();
                message.success('注册成功！')
                registerSingleUser.resetFields();
            }
        } catch (error) {
            if (error.response.status === 400) {
                console.log('Response: ', error.response.data);
                message.error('工号已被注册！')
            } else {
                console.log('Response: ', error.response.data);
                message.error('发生了一些错误，请稍后再试！')
            }
        }
    };

    return(
        <App>
            <Card>
            <Alert
                message={user_level === 'Level 0' ? `您正在以最高权限（Level 0）身份注册管理员（Level 1），下属用户将可以使用您注册的账号登录系统并可以创建新的普通用户，你们公司的工号数为${numberCode}位。`
                    : `您正在以管理员（Level 1）身份注册普通账号以使用我们的系统，你们公司的工号数为${numberCode}位。`}
                type="info"
                showIcon
                closable
                style={{ marginBottom: '2vh' }}
            />
            <Form
                name="registerSingleUser"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: '80%',
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                form={registerSingleUser}
            >
                <Form.Item
                    label="工号"
                    name="jobnumber"
                    tooltip="我们会默认工号作为用户名。"
                    rules={[
                        {
                            required: true,
                            message: '请输入要注册的工号!',
                        },
                        () => ({
                            validator(_, value) {
                                if (!value || value.length !== numberCode) {
                                    return Promise.reject(new Error('工号长度不正确！'));
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码!',
                        },
                        () => ({
                            validator(_, value) {
                                if (!value || !checkComplexity(value)) {
                                    return Promise.reject(new Error('密码过于简单，请包含大写字母、数字和特殊字符'));
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="确认密码"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: '请确认您的密码!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('您输入的新密码不匹配！'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 14,
                        span: 10,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>
            </Card>
        </App>
    )
});