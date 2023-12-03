import React, {useState} from "react";
import {
    Alert,
    AutoComplete,
    Button,
    Card,
    Cascader,
    Checkbox,
    Col,
    Form,
    Input,
     Modal,
    Row,
    Select,
    Space
} from "antd";
import AgreementModal from "../../components/Modal/AgreementModal";

const { Option } = Select;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 4,
        },
    },
};

function SubordinateUserRegistration() {
    const [form] = Form.useForm();
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };
    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select
                style={{
                    width: 70,
                }}
            >
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        </Form.Item>
    );

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [hasReadAgreement, setHasReadAgreement] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        setHasReadAgreement(true); // 用户已经阅读协议
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return (
        <div>
            <Card title="下属用户注册" style={{ height: '90vh', overflow: 'auto' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                <Alert
                    message="这里是用户注册下属用户，拥有不完整功能。"
                    type="info"
                    showIcon
                    closable={true}
                    style={{ marginBottom: '24px' }} // 增加下边距
                />

                    <Form
                        {...formItemLayout}
                        form={form}
                        name="register"
                        onFinish={onFinish}
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Row gutter={16}>
                            {/* 每个 Col 用于包裹一个 Form.Item，通过设置 span 来调整宽度 */}
                            <Col span={12}>
                                <Form.Item name="email" label="邮箱" rules={[
                                    {
                                        type: 'email',
                                        message: '输入的电子邮件无效！',
                                    },
                                    {
                                        required: true,
                                        message: '请输入您的电子邮件！',
                                    },
                                ]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="phone"
                                    label="电话号码"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入您的电话号码！',
                                        },
                                    ]}
                                >
                                    <Input
                                        addonBefore={prefixSelector}
                                        style={{
                                            width: '100%',
                                        }}
                                    />
                                </Form.Item>

                            </Col>
                            <Col span={12}>
                                <Form.Item name="password" label="密码" rules={[
                                    {
                                        required: true,
                                        message: '请输入您的密码！',
                                    },
                                ]}
                                           hasFeedback>
                                    <Input.Password />
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
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="nickname"
                                    label="昵称"
                                    tooltip="你希望别人怎么称呼你？"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入您的昵称！',
                                            whitespace: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="gender"
                                    label="性别"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择性别！',
                                        },
                                    ]}
                                >
                                    <Select placeholder="请选择性别">
                                        <Option value="male">男</Option>
                                        <Option value="female">女</Option>
                                        <Option value="other">其他</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="company" label="公司" rules={[
                                    {
                                        required: true,
                                        message: '请输入您的公司！',
                                    },
                                ]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="intro"
                                    label="介绍"
                                    rules={[
                                    ]}
                                >
                                    <Input.TextArea showCount maxLength={100} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="agreement"
                                    valuePropName="checked"
                                    rules={[
                                        {
                                            validator: (_, value) =>
                                                value ? Promise.resolve() : Promise.reject(new Error('您必须同意协议才能注册')),
                                        },
                                    ]}
                                    {...tailFormItemLayout}
                                >
                                    <Checkbox onChange={(e) => setHasReadAgreement(e.target.checked)}>
                                        我已阅读 <a onClick={showModal}>协议</a>
                                    </Checkbox>
                                </Form.Item>
                                <Modal title="协议内容" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                                {/* 这里填入您的协议内容 */}
                                <p>这里是协议内容...</p>
                            </Modal>
                            </Col>
                        </Row>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    注册
                                </Button>
                            </Form.Item>

                        </div>
                    </Form>
            </Space>
            </Card>
        </div>
    );
}

export default SubordinateUserRegistration;