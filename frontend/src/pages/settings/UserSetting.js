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
    message,
} from 'antd';
import {EditOutlined,} from "@ant-design/icons";
import {userStore} from '../../store/userStore'
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



const UserSetting = observer(() => {
    const {userInfo, infoChangeHint} = userStore;

    useEffect(() => {
        form.setFieldsValue({
            email: userInfo.email,
            phone: userInfo.phone,
            password: userInfo.password,
            confirm: userInfo.password,
            nickname: userInfo.username,
            gender: userInfo.gender,
            company: userInfo.companyName,
            numberCode: userInfo.numberCode,
        });
    }, [userInfo]);

    const [form] = Form.useForm();
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    //     对mobx中的数据进行更新，并更新到数据库中
        userStore.updateUserInfo(values);
        console.log(infoChangeHint)
        if (infoChangeHint.status === 'success'){
            message.success(infoChangeHint.message)
        }else{
            message.error(infoChangeHint.message)
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
            <Avatar size={128} src={userInfo.avatar}/>
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
                                <h5>{userInfo.jobNumber}</h5>
                                <Tag key={userInfo.userLevel} color='processing' bordered={false}>{userInfo.userLevel}</Tag>
                            </Col>
                        </div>
                    </Col>

                    <Col span={16}>
                        <Form
                            {...formItemLayout}
                            form={form}
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

                            <Form.Item name="company" label="公司" rules={[
                                {
                                    required: true,
                                    message: '请输入您的公司！',
                                },
                            ]}>
                                <Input/>
                            </Form.Item>


                            <Form.Item name="numberCode" label="工号位数" rules={[
                                {
                                    required: true,
                                    message: '请输入您的公司工号位数！',
                                },
                            ]}>
                                <Input/>
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
        </Space>
    );
})

export default UserSetting;