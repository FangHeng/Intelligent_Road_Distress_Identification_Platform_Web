import {
    App,
    Avatar,
    Button,
    Checkbox,
    Col,
    Descriptions,
    Divider,
    Form,
    Input,
    Row,
    Select,
    Tag,
    Typography,
    Upload
} from "antd";
import React, {useEffect, useState} from "react";
import userStore from "../../store/UserStore";
import {EditOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import companyStore from "../../store/CompanyStore";
import {maskString} from "../../utils/utils";

const {Title, Text} = Typography;
const {Option} = Select;

const BasicInfo = observer(() => {
    const userInfo = userStore.userInfo;
    const [formPersonalInfo] = Form.useForm();
    const [componentDisabled, setComponentDisabled] = useState(true);
    const {message} = App.useApp();

    const isEditMode = !componentDisabled;

    useEffect(() => {
        const personalInfofieldsValue = {
            email: isEditMode ? userInfo.email : maskString(userInfo.email),
            phone: isEditMode ? userInfo.phone_number : maskString(userInfo.phone_number),
            nickname: userInfo.username ?? '',
            gender: userInfo.gender ?? '',
        };

        // 过滤掉值为 null 或空字符串的字段
        const filteredPersonalInfofieldsValue = Object.fromEntries(
            Object.entries(personalInfofieldsValue).filter(([_, value]) => value != null && value !== '')
        );

        formPersonalInfo.setFieldsValue(filteredPersonalInfofieldsValue);
    }, [formPersonalInfo, userInfo, isEditMode]);

    useEffect(() => {
        const fetchEmployeeNumber = async () => {
            await companyStore.fetchEmployeeNumber();
        }

        fetchEmployeeNumber().catch((error) => {
            message.error('获取员工工号长度失败！');
        });
    }, []);

    const onInfoFinish = async (values) => {
        // 调用 updateUserInfo 来更新用户信息
        await userStore.updateUserInfo(values);
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
                    beforeUpload={(file) => {
                        userStore.changeAvatar(file);
                        return false;
                    }}
                >
                    <Button shape="circle" icon={<EditOutlined/>}/>
                </Upload>
            </div>
        </div>
    );

    const companyItems = [
        {
            key: '1',
            label: '公司名称',
            children: `${userInfo.company_name}`,
        },
        {
            key: '2',
            label: '工号位数',
            children: `${companyStore.employeeNumber}`,
        },
    ];

    return(
    <App>
        <div style={{ margin: '0 20' }}>
            <Title level={4}>基本信息
                <Checkbox
                    style={{flex: 1, float: 'right'}}
                    onChange={(e) => {
                        setComponentDisabled(!e.target.checked);
                    }}
                >
                    <Text type="secondary">编辑</Text>
                </Checkbox>
            </Title>
            <Text type="secondary">请及时更新信息以便找回密码，在第一次登陆后请注意填写邮箱！</Text>
            <Divider />
        </div>
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
                        <Text strong style={{marginTop: '5px'}}>{userInfo.username}</Text>
                        <Text strong>{userInfo.employee_number}</Text>
                        <Tag key={userInfo.user_level} bordered={false}
                             color="blue">{userInfo.user_level}</Tag>
                    </Col>
                </div>
            </Col>

            <Col span={10}>
                <Form
                    layout={'vertical'}
                    form={formPersonalInfo}
                    name="userSetting"
                    onFinish={onInfoFinish}
                    initialValues={{
                        prefix: '86',
                    }}
                    scrollToFirstError
                    disabled={componentDisabled}
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

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            更新
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
        <div style={{ margin: '0 20' }}>
            <Title level={4}>公司信息</Title>
            <Text type="secondary">公司信息由管理员维护，如有问题请联系管理员！</Text>
            <Divider />
            <Descriptions layout="vertical" items={companyItems}/>
        </div>
    </App>
    );
});

export default BasicInfo;