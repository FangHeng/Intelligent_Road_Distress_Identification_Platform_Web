import {Badge, Button, message, Space, Table, Tag} from "antd";
import {UserDeleteOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import userStore from "../../store/UserStore";
import {observer} from "mobx-react-lite";

const adaptDataForTable = (dataFromBackend) => {
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
    useEffect(() => {
        userStore.fetchSubordinatesInfo();
    }, [userStore]);


    useEffect(() => {
        if (userStore.subordinatesInfo && Array.isArray(userStore.subordinatesInfo)) {
            const adaptedData = adaptDataForTable(userStore.subordinatesInfo);
            setData(adaptedData);
        }
    }, [userStore.subordinatesInfo]);

    useEffect(() => {
        if (userStore.errorsubordinatesInfo) {
            message.error('获取下属用户信息失败！');
        }
    }, [userStore.errorsubordinatesInfo]);  // 依赖项为 errorsubordinatesInfo



    // const data = [
    //     {
    //         key: '1',
    //         jobNumber: '123456',
    //         status: '已激活',
    //         userLevel: 'Level 0',
    //         lastLogin: '2023-04-01 12:00:00',
    //         recordCount: 10,
    //         fileCount: 5,
    //     },
    //     {
    //         key: '2',
    //         jobNumber: '123456',
    //         status: '未登录',
    //         userLevel: 'Level 1',
    //         lastLogin: '',
    //         recordCount: 10,
    //         fileCount: 5,
    //     },
    //     // ...其他数据...
    // ];

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
        // 调用后端API来删除用户
        fetch(`your-backend-url/deleteUser/${userId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    // 处理删除成功的情况
                    console.log('用户删除成功');
                    // 在这里可以更新表格数据或者重新加载用户列表
                } else {
                    // 处理删除失败的情况
                    console.error('删除用户失败');
                }
            })
            .catch(error => {
                console.error('删除用户失败', error);
            });
    };

    return(
        <Table columns={columns} dataSource={data} />
    )
});

export default UserTable;