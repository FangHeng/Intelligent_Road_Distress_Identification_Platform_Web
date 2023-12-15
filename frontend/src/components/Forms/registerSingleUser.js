import {Alert, Button, Form, Input} from "antd";
import React from "react";
import {userStore} from "../../store/userStore";
import {observer} from "mobx-react-lite";

const onFinish = (values) => {
    console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};



export const RegisterSingleUser = observer(() =>{
    const {userLevel, numberCode} = userStore.userInfo
    return(
        <>
            <Alert
                message={userLevel === 'root' ? `您正在以root身份注册管理员，下属用户将可以使用您注册的账号登录系统并可以创建新的普通用户，你们公司的工号数为${numberCode}位。`
                    : `您正在以管理员身份注册普通账号以使用我们的系统，你们公司的工号数为${numberCode}位。`}
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
            >
                <Form.Item
                    label="工号"
                    name="jobnumber"
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