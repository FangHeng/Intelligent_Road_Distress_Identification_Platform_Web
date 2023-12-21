import {Alert, Button, Form, Input, message} from "antd";
import React from "react";
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

    const [registerSingleUser] = Form.useForm();

    const onFinish = async (values) => {
        // 构建要发送的数据
        const formData = new FormData();
        formData.append('employee_number', values.jobnumber);
        formData.append('password', values.password);


        try {
            const response = await axiosInstance.post('/irdip/register_subordinate/', formData);
            if (response.data.status === 'success') {
                userStore.fetchSubordinatesInfo();
                console.log('User registered successfully');
                message.success('注册成功！')
            } else if(response.data.status === 400){
                console.log('Response: ', response.data);
                message.error('工号已被注册！')
            }
        } catch (error) {
            message.error('发生了一些错误，请稍后再试！')
            console.error('Error during registration: ', error);
            }
        };

    return(
        <>
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
        </>
    )
}
);