// RegisterMultipleUser.js: 批量注册用户
import {Alert, Button, Card, Col, Form, Input, Row} from "antd";
import React from "react";
import userStore from "../../store/UserStore";
import {observer} from "mobx-react-lite";
import companyStore from "../../store/CompanyStore";
import {checkComplexity} from "../../utils/utils";

const onFinish = (values) => {
    console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

export const RegisterMultipleUser = observer (()=> {
    const {user_level } = userStore.userInfo;
    const numberCode = companyStore.employeeNumber;
    return (
        <Card>
            <Alert
                message={user_level === 'Level 0' ? `您正在以最高权限（Level 0）身份批量注册管理员（Level 1），下属用户将可以使用您注册的账号登录系统并可以创建新的普通用户，你们公司的工号数为${numberCode}位。`
                    : `您正在以管理员（Level）身份批量注册普通账号以使用我们的系统，你们公司的工号数为${numberCode}位。`}
                type="info"
                showIcon
                closable
                style={{marginBottom: '2vh'}}
            />
            <Form
                name="registerMultipleUser"
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
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="起始工号"
                            name="jobnumberbegin"
                            rules={[{required: true, message: '请输入要注册的工号范围!'}]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="终止工号"
                            name="jobnumberend"
                            rules={[{required: true, message: '请输入要注册的工号范围!'}]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
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
                                    },
                                }),
                            ]}
                        >
                            <Input.Password/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
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
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('您输入的新密码不匹配！'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password/>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    wrapperCol={{
                        offset: 13,
                        span: 10,
                    }}
                >
                    <Button type="primary" htmlType="submit" style={{ marginTop: '10px' }}>
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
});
