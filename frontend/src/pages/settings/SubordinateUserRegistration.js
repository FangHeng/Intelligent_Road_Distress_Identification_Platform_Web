// SubordinateUserRegistration.js: 下属用户注册
import React from 'react';
import { Link } from 'react-router-dom';
import {Button, Result, Space, Card, } from 'antd';
import UserTable from "../../components/Table/UserTable";
import {RegisterSingleUser} from "../../components/Forms/registerSingleUser";
import {RegisterMultipleUser} from "../../components/Forms/registerMultipleUser";
import {UserAddOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import userStore from "../../store/UserStore";
import {observer} from "mobx-react-lite";
import {PageContainer} from "@ant-design/pro-components";

const SubordinateUserRegistration = observer(() => {
    const { user_level } = userStore.userInfo;

    // 根据用户等级设置内容
    const getContent = () => {
        switch (user_level) {
            case 'Level 0':
            case 'Level 1':
                return (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Card>
                            <UserTable />
                        </Card>
                    </Space>
                );
            default:
                return (
                    <div style={{ height: '95vh' }}>
                        <Result
                            status="403"
                            title="403"
                            subTitle="对不起，你没有权限访问这个页面。"
                            extra={
                                <Link to="/pages/home">
                                    <Button type="primary">返回首页</Button>
                                </Link>
                            }
                        />
                    </div>
                );
        }
    };

    const content = getContent(); // 获取相应的内容

    // 渲染页面或权限提示
    return (
        user_level === 'Level 0' || user_level === 'Level 1' ? (
            <PageContainer
                title='注册下属用户'
                tabList={[
                    {
                        tab: '单个注册',
                        key: 'single', // 注意保持 key 值的小写
                        icon: <UserAddOutlined />,
                        children: <RegisterSingleUser />,
                    },
                    {
                        tab: '批量注册',
                        key: 'multiple', // 保持一致性
                        icon: <UsergroupAddOutlined />,
                        children: <RegisterMultipleUser />,
                    },
                ]}
            >
                {content}
            </PageContainer>
        ) : (
            content
        )
    );
});


export default SubordinateUserRegistration;