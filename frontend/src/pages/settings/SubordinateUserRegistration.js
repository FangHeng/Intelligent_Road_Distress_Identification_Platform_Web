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
    const {user_level} = userStore.userInfo;

    let content;
    switch (user_level) {
        case 'Level 0':
            content = (
                <Space
                    direction="vertical"
                    style={{
                        width: '100%',
                    }}
                >
                    <Card >
                        <UserTable />
                    </Card>
                </Space>
            );
            break;
        case 'Level 1':
            content = (
                <Space
                    direction="vertical"
                    style={{
                        width: '100%',
                    }}
                >
                    <Card >
                        <UserTable />
                    </Card>
                </Space>
            );
            break;
        default:
            content = (
                <div style={{ height: '95vh' }}>
                    <Result
                        status={403}
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

    return <PageContainer
        title='注册下属用户'
        tabList={[
            {
                tab: '单个注册',
                key: 'Single',
                icon: <UserAddOutlined />,
                children: <RegisterSingleUser />,
            },
            {
                tab: '批量注册',
                key: 'multiple',
                icon: <UsergroupAddOutlined />,
                children: <RegisterMultipleUser />,
            },
        ]}
    >{content}</PageContainer>;
});

export default SubordinateUserRegistration;