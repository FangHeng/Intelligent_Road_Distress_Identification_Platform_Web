import React, {useEffect} from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Space,
    Row,
    Col,
    Upload,
    Tag,
    Avatar,
    Select,
    message, Descriptions,
} from 'antd';
import {EditOutlined} from "@ant-design/icons";
import userStore from '../../store/UserStore'
import companyStore from "../../store/CompanyStore";
import { observer } from 'mobx-react-lite'
import {checkComplexity} from "../../utils/utils";
import {useNavigate} from "react-router-dom";
import {reaction} from "mobx";


const {Option} = Select;

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 2},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
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
            offset: 8,
        },
    },
};

const colformItemLayout = {
    labelCol: {
        xs: {span: 21},
        sm: {span: 5},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};

const colTailformItemLayout = {
    wrapperCol: {
        xs: {
            span: 12,
            offset: 12,
        },
        sm: {
            span: 14,
            offset: 10,
        },
    },
};

const UserSetting = observer(() => {
    const {userInfo, infoChangeHint} = userStore;
    const {employeeNumber} = companyStore;

    const navigate = useNavigate()

    useEffect(() => {
        // 添加性别映射逻辑
        const genderMapping = {
            'Male': '男',
            'Female': '女',
            'Other': '其他'
        };

        // 使用映射逻辑来更新性别字段
        const genderValue = genderMapping[userInfo.gender] ?? '';

        const personalInfofieldsValue = {
            email: userInfo.email ?? '',
            phone: userInfo.phone_number ?? '',
            nickname: userInfo.username ?? '',
            gender: genderValue, // 使用映射后的性别值
        };

        // 过滤掉值为 null 或空字符串的字段
        const filteredPersonalInfofieldsValue = Object.fromEntries(
            Object.entries(personalInfofieldsValue).filter(([_, value]) => value != null && value !== '')
        );

        formPersonalInfo.setFieldsValue(filteredPersonalInfofieldsValue);
    }, [userInfo]);

    const [formPersonalInfo] = Form.useForm();
    const [formPasswordSet] = Form.useForm();

    const companyItems = [
        {
            key: '1',
            label: '公司名称',
            children: `${userInfo.company_name}`,
        },
        {
            key: '2',
            label: '工号位数',
            children: `${employeeNumber}`,
        },
    ];

    const onInfoFinish = async (values) => {
        console.log('Received values of form: ', values);

        // 调用 updateUserInfo 来更新用户信息
        await userStore.updateUserInfo(values);

    };

    const onPasswordFormFinish = async (values) => {
        const { oldPassword, newPassword } = values;
        const result = await userStore.changePassword(oldPassword, newPassword);

        if (result.success) {
            // 显示成功消息
            message.success(result.message);
            await userStore.logout()
            navigate('/');
        } else {
            // 显示错误消息
            message.error(result.message);
        }
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

    const handleFileChange = (info) => {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            console.log(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            console.log(`${info.file.name} file upload failed.`);
        }
    };

    const uploadButton = (
        <div>
            <Avatar size={128} src={userInfo.avatar}/>
            <div style={{position: 'absolute', right: 0, top: 0}}>
                <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={(file) => {
                        userStore.changeAvatar(file);
                        return false;
                    }}
                    onChange={handleFileChange}
                >
                    <Button shape="circle" icon={<EditOutlined/>}/>
                </Upload>
            </div>
        </div>
    );

    useEffect(() => {
        const dispose = reaction(
            () => infoChangeHint,
            (infoChangeHint) => {
                console.log('Reaction triggered:', infoChangeHint);
                if (infoChangeHint.status === 'success') {
                    message.success(infoChangeHint.message);
                } else if (infoChangeHint.status === 'error') {
                    message.error(infoChangeHint.message);
                } else {
                    message.warning(infoChangeHint.message);
                }
            }
        );

        return () => dispose(); // 在组件卸载时清理
    }, []);

    return (
        <Space
            direction="vertical"
            size="middle"
            style={{
                display: 'flex',
                justifyContent: 'center', // 使内容居中
            }}
        >
            <Card title="用户信息设置">
                <Row gutter={24}>
                    <Col span={7}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
                            <Col span={8} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {uploadButton}
                                <h5>{userInfo.username}</h5>
                                <h5>{userInfo.employee_number}</h5>
                                <Tag key={userInfo.user_level}  bordered={false} color="blue">{userInfo.user_level}</Tag>
                            </Col>
                        </div>
                    </Col>

                    <Col span={16}>
                        <Form
                            {...formItemLayout}
                            form={formPersonalInfo}
                            name="userSetting"
                            onFinish={onInfoFinish}
                            initialValues={{
                                prefix: '86',
                            }}
                            scrollToFirstError
                        >
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
                                <Input/>
                            </Form.Item>


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
                                <Input/>
                            </Form.Item>


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
                                    <Option value="Male">男</Option>
                                    <Option value="Female">女</Option>
                                    <Option value="Other">其他</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit" >
                                    确认
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Card>
            <Row gutter={16}>
                <Col span={12}>
                    <Card title='你的公司' style={{height:'40vh'}}>
                        <Descriptions layout="vertical" bordered items={companyItems} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="修改密码" style={{height:'40vh'}}>
                        <Form
                            {...colformItemLayout}
                            form={formPasswordSet}
                            name="passwordSetting"
                            onFinish={onPasswordFormFinish}
                            initialValues={{
                                prefix: '86',
                            }}
                            scrollToFirstError
                        >
                            <Form.Item name="oldPassword" label="旧密码" rules={[
                                {
                                    required: true,
                                    message: '请输入您的密码！',
                                },
                            ]}
                                   >
                                <Input.Password/>
                            </Form.Item>
                            <Form.Item name="newPassword" label="新密码" rules={[
                                {
                                    required: true,
                                    message: '请输入您的新密码！',
                                },
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        if (!value || !checkComplexity(value)) {
                                            return Promise.reject(new Error('密码过于简单，请包含大写字母、数字和特殊字符'));
                                        }
                                        if (value === getFieldValue('oldPassword')) {
                                            return Promise.reject(new Error('新密码不能与旧密码相同'));
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                                       hasFeedback>
                                <Input.Password/>
                            </Form.Item>


                            <Form.Item
                                name="confirmPassword"
                                label="确认新密码"
                                dependencies={['newPassword']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: '请确认您的密码!',
                                    },
                                    ({getFieldValue}) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('您输入的新密码不匹配！'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password/>
                            </Form.Item>
                            <Form.Item {...colTailformItemLayout}>
                                <Button type="primary" htmlType="submit">
                                    确认
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

            </Row>
        </Space>
    );
})

export default UserSetting;