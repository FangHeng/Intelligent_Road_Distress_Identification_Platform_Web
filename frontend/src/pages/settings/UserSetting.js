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
import {EditOutlined, UserOutlined,} from "@ant-design/icons";
import userStore from '../../store/UserStore'
import companyStore from "../../store/CompanyStore";
import { observer } from 'mobx-react-lite'


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

    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
        const response = await userStore.updateUserInfo(values);
        if (response && response.message === "用户信息已更新") {
            // 成功更新
            message.success('用户信息已更新！')
            userStore.updateUserInfo(values);
        } else {
            // 更新失败，处理错误
            message.error('用户信息更新失败！')
        }

    };


    const handleUpload = async ({ file }) => {
        try{
            // 创建一个 FormData 对象来存储文件
            const formData = new FormData();
            formData.append('avatar', file);

            // 上传文件到服务器
            const response = await fetch('http://your-backend-url/api/upload-avatar', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                // 假设服务器返回的数据中包含了新的头像的 URL
                userStore.updateUserInfo({ avatar: data.avatar });
                if (infoChangeHint.status === 'success'){
                    message.success(infoChangeHint.message)
                }else{
                    message.error(infoChangeHint.message)
                }
            } else {
                message.error('头像更新失败！')
                console.error('Failed to upload file.');
            }
        }catch (error) {
            message.error('头像更新失败！')
            console.log(error)
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

    const uploadButton = (
        <div>
            <Avatar size={128} src={userStore.getAvatarUrl()}/>
            <div style={{position: 'absolute', right: 0, top: 0}}>
                <Upload
                    accept="image/*"
                    showUploadList={false}
                    onChange={handleUpload}
                >
                    <Button shape="circle" icon={<EditOutlined/>}/>
                </Upload>
            </div>
        </div>
    );

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
                            onFinish={onFinish}
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
                                    <Option value="male">男</Option>
                                    <Option value="female">女</Option>
                                    <Option value="other">其他</Option>
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
                            onFinish={onFinish}
                            initialValues={{
                                prefix: '86',
                            }}
                            scrollToFirstError
                        >
                            <Form.Item name="password" label="密码" rules={[
                                {
                                    required: true,
                                    message: '请输入您的密码！',
                                },
                            ]}
                                       hasFeedback>
                                <Input.Password/>
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