import React, {useEffect, useState} from 'react';
import {
    Card,
    Form,
    App, Menu, Layout, theme, Input, Modal, Breadcrumb
} from 'antd';
import userStore from '../../store/UserStore'
import {observer} from 'mobx-react-lite'
import {checkComplexity} from "../../utils/utils";
import {useNavigate} from "react-router-dom";
import {reaction} from "mobx";
import {PageContainer} from "@ant-design/pro-components";
import AccountSecurity from "../../components/AccountSetting/AccountSecurity";
import Appearance from "../../components/AccountSetting/Appearance";
import BasicInfo from "../../components/AccountSetting/BasicInfo";

const menuItems = [
    {
        label: '基本信息',
        key: 'basicInfo',
    },
    {
        label: '账户安全',
        key: 'accountSecurity',
    },
    {
        label: '其他设置',
        key: 'otherSettings',
    },
];


const UserSetting = observer(() => {
    const [formPasswordSet] = Form.useForm();

    const navigate = useNavigate();
    const {message} = App.useApp();

    const onPasswordFormFinish = async (values) => {
        const {oldPassword, newPassword} = values;
        const result = await userStore.changePassword(oldPassword, newPassword);

        if (result.success) {
            // 显示成功消息
            message.success(result.message);
            // 停留几秒，并跳转到登录页面
            await new Promise((resolve) => setTimeout(resolve, 2000));
            await userStore.logout();
            navigate('/');
        } else {
            // 显示错误消息
            message.error(result.message);
        }
    };


    useEffect(() => {
        reaction(
            () => userStore.infoChangeHint,
            (infoChangeHint) => {
                if (infoChangeHint.status === 'success') {
                    console.log(111111)
                    // 显示成功消息
                    message.success(infoChangeHint.message);
                } else if (infoChangeHint.status === 'error') {
                    // 显示错误消息
                    message.error(infoChangeHint.message);
                } else {
                    // 显示警告消息
                    message.warning(infoChangeHint.message);
                }
            }
        );
    }, []);

    const [currentTab, setCurrentTab] = useState('basicInfo');

    const [currentRecord, setCurrentRecord] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleEdit = (record) => {
        if (record.id === '1') {
            // 如果是密码修改，显示模态框
            setCurrentRecord(record);
            setIsModalVisible(true);
        } else {
            // 如果是其他设置项，根据项的 id 切换到对应的菜单界面
            // const keyMap = {
            //
            //     // 这里可以扩展更多的映射
            // };
            // const key = keyMap[record.id];
            setCurrentTab('basicInfo');
        }
    };

    const renderContent = () => {
        switch (currentTab) {
            case 'basicInfo':
                return (
                    <BasicInfo />
                );
            case 'accountSecurity':
                return (
                    <AccountSecurity onEdit={handleEdit}/>
                );
            case 'otherSettings':
                return (
                    <Appearance />
                );
            default:
                return null;
        }
    };
    const {Sider, Content} = Layout;

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    return (
        <App>

            <PageContainer

                header={{
                    title: '账户设置',
                }}
                content='管理您的个人信息以及系统设置。'

            >

                <Card>
                    <Layout>
                        <Sider width={200} theme={'light'}>
                            <Menu
                                mode="inline"
                                selectedKeys={[currentTab]}
                                onClick={({key}) => setCurrentTab(key)}
                                theme="light"
                                items={menuItems}
                            >
                            </Menu>
                        </Sider>
                        <Layout>
                            <Content style={{padding: '0 24px', minHeight: 280, background: colorBgContainer}}>
                                {renderContent()}
                            </Content>
                        </Layout>
                    </Layout>
                </Card>
                <Modal
                    title="编辑设置"
                    open={isModalVisible}
                    onOk={() => {
                        // 表单提交
                        formPasswordSet
                            .validateFields()
                            .then((values) => {
                                formPasswordSet.resetFields();
                                // handleSave(values);
                                onPasswordFormFinish(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={() => setIsModalVisible(false)}
                >
                    <Form
                        form={formPasswordSet}
                        name="passwordSetting"
                        scrollToFirstError
                        layout={'vertical'}
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
                    </Form>
                </Modal>
            </PageContainer>
        </App>
    );
})

export default UserSetting;