import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {Button, Result, Space, Card, Tooltip, Segmented} from 'antd';
import UserTable from "../../components/Table/UserTable";
import {RegisterSingleUser} from "../../components/Forms/registerSingleUser";
import {RegisterMultipleUser} from "../../components/Forms/registerMultipleUser";
import {UserAddOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import {userStore} from "../../store/userStore";
import {observer} from "mobx-react-lite";

const SubordinateUserRegistration = observer(() => {
    const {userLevel} = userStore.userInfo;

    const [viewMode, setViewMode] = useState('single');

    const handleSegmentChange = (value) => {
        setViewMode(value === 'Single' ? 'single' : 'multiple');
    };

    const cardTitle = (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>注册下属用户</span>
                <Tooltip title="单个或批量注册">
                    <Segmented
                        options={[
                            {
                                value: 'Single',
                                icon: <UserAddOutlined />,
                            },
                            {
                                value: 'Multiple',
                                icon: <UsergroupAddOutlined />,
                            },
                        ]}
                        onChange={handleSegmentChange}
                    />
                </Tooltip>
            </div>
    );

    let content;
    switch (userLevel) {
        case 'root':
            content = (
                <Space
                    direction="vertical"
                    style={{
                        width: '100%',
                    }}
                >
                    <Card title={cardTitle} style={{ height: '40vh', overflow: 'True' }} >
                        {viewMode === 'single' ? <RegisterSingleUser /> : <RegisterMultipleUser />}
                    </Card>
                    <Card title='下属用户列表' style={{ height: '55vh' }}>
                        <UserTable />
                    </Card>
                </Space>
            );
            break;
        case '管理员':
            content = (
                <Space
                    direction="vertical"
                    style={{
                        width: '100%',
                    }}
                >
                    <Card title={cardTitle} style={{ height: '40vh', overflow: 'True' }} >
                        {viewMode === 'single' ? <RegisterSingleUser /> : <RegisterMultipleUser />}
                    </Card>
                    <Card title='下属用户列表' style={{ height: '55vh' }}>
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

    return <>{content}</>;
});

export default SubordinateUserRegistration;