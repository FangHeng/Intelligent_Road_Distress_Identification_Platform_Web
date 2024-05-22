import React, {useState} from 'react';
import {ProList} from '@ant-design/pro-components';
import {Button, Typography, App} from 'antd';
import userStore from "../../store/UserStore";
import {maskString} from "../../utils/utils";


const {Title, Text} = Typography;

const AccountSecurity = ({onEdit}) => {
    const defaultData = [
        {
            id: '1',
            setting: '密码修改',
            description: '当前密码强度：强',
        },
        {
            id: '2',
            setting: '手机绑定',
            description: `已绑定手机：${maskString(userStore.userInfo.phone_number)}`,
        },
        {
            id: '3',
            setting: '邮箱绑定',
            description: `已绑定邮箱：${maskString(userStore.userInfo.email)}`,
        },
    ];

    const [dataSource, setDataSource] = useState(defaultData);

    const handleEdit = (record) => {
        onEdit(record);
    }

    return (
        <App>
            <div style={{margin: '0 20'}}>
                <Title level={4}>账户安全
                </Title>
                <Text type="secondary">通过修改密码等方式，增加账户安全性</Text>
            </div>
            <ProList
                rowKey="id"
                headerTitle="安全设置"
                dataSource={dataSource}
                pagination={false}
                search={false}
                toolBarRender={false}
                metas={{
                    title: {
                        dataIndex: 'setting',
                    },
                    description: {
                        dataIndex: 'description',
                    },
                    actions: {
                        render: (text, record) => [
                            <Button type="link" key={`edit-${record.id}`} onClick={() => handleEdit(record)}>
                                编辑
                            </Button>,
                        ],
                    },
                }}
            />
        </App>
    );
};

export default AccountSecurity;