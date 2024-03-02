// UserTable.js: 下属用户表格
import {App, Badge, Button, Space, Table, Tag} from "antd";
import {UserDeleteOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import userStore from "../../store/UserStore";
import {observer} from "mobx-react-lite";

const adaptDataForTable = (dataFromBackend) => {
    if (!Array.isArray(dataFromBackend)) {
        console.error('Expected an array for adaptDataForTable, received:', dataFromBackend);
        return [];
    }

    return dataFromBackend.map(item => ({
        key: item.user_id,
        jobNumber: item.employee_number,
        status: item.is_active ? '已激活' : '未激活',
        userLevel: item.user_level,
        lastLogin: item.last_login ? new Date(item.last_login).toLocaleString() : '',
        recordCount: item.upload_record_count,
        fileCount: item.total_upload_files,
        userId: item.user_id
    }));
};

const UserTable = observer(() => {
    const [data, setData] = useState([]);
    const {message} = App.useApp();

    useEffect(() => {
        const fetchInfo = async () => {
            const result = await userStore.fetchSubordinatesInfo();
            if (!result.success && result.message) {
                message.error(result.message);
            }
        };

        fetchInfo();
    }, []);

    useEffect(() => {
        setData(adaptDataForTable(userStore.subordinatesInfo));
    }, [userStore.subordinatesInfo]);

    const columns = [
        {
            title: '工号',
            dataIndex: 'jobNumber',
            key: 'jobNumber',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: status => (
                <Badge status={status === '已激活' ? 'processing' : 'warning'} text={status} />
            ),
        },
        {
            title: '用户等级' ,
            dataIndex: 'userLevel',
            key: 'userLevel',
            render: userLevel => (
                <Tag color='blue'>{userLevel}</Tag>
            ),
        },
        {
            title: '最后登陆时间',
            dataIndex: 'lastLogin',
            key: 'lastLogin',
            render: lastLogin => (
                <Tag>{lastLogin === '' ? '' : lastLogin}</Tag>
            ),
        },
        {
            title: '上传记录数',
            dataIndex: 'recordCount',
            key: 'recordCount',
        },
        {
            title: '上传文件数',
            dataIndex: 'fileCount',
            key: 'fileCount',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="small">
                    <Button danger type='link' onClick={() => handleDelete(record.userId)}><UserDeleteOutlined />删除用户</Button>
                </Space>
            ),
        },
    ];

    const handleDelete = (userId) => {
        userStore.deleteSubordinate(userId).then((result) => {
            if (result.success) {
                message.success('用户删除成功！');
                // 过滤掉被删除的用户
                const filteredData = data.filter(item => item.userId !== userId);
                setData(filteredData);
            } else {
                message.error(result.message);
            }
        });
    };

    return(
        <App>
            <Table
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 10 }}
            />
        </App>
    )
});

export default UserTable;