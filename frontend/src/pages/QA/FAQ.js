// FAQ.js: 常见问题解答
import { ProList } from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import {Button, Modal, Tag} from "antd";
import {PlusOutlined} from "@ant-design/icons";

const initialDataSource  = [
    {
        id: '1',
        title: '如何重置我的密码？',
        content: '如果你忘记了密码，可以通过点击登录界面的“忘记密码”链接来重置你的密码。',
        descriptions: ['安全', '账户管理'],
    },
    {
        id: '2',
        title: '如何更改我的邮箱地址？',
        content: '你可以在个人设置页面更改你的邮箱地址。',
        descriptions: ['个人信息', '账户管理'],
    },
];


const FAQ = () => {
    const [dataSource, setDataSource] = useState(initialDataSource );
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    // 用于搜索
    const [searchValue, setSearchValue] = useState('');


    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        // 添加新问题的逻辑
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        let filteredData = dataSource;

        if (searchValue === '') {
            filteredData = initialDataSource;
        } else {
            filteredData = filteredData.filter(
                item =>
                    item.title.includes(searchValue) ||
                    item.content.includes(searchValue) ||
                    item.descriptions.includes(searchValue)
            );
        }

        setDataSource(filteredData);
    }, [searchValue]);


    return (
        <div>
            <div>
                <Modal
                    title="新建问题"
                    open={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    {/* 模态框内容 */}
                </Modal>
            </div>
            <ProList
                itemLayout="vertical"
                rowKey="id"
                headerTitle="常见问题解答"
                dataSource={dataSource}
                metas={{
                    title: {},
                    content: {
                        render: (_, item) => {
                            return <div>{item.content}</div>;
                        },
                    },
                    description: {
                        render: (_, item) => {
                            return item.descriptions.map((desc, index) => (
                                <Tag key={index}>{desc}</Tag>
                            ));
                        },
                    },

                }}
                toolbar={{
                    search: {
                        onSearch: (value) => {
                            setSearchValue(value);
                        },
                    },
                    actions: [
                        <Button type='primary' onClick={showModal}><PlusOutlined />
                            新增
                        </Button>,
                    ],
                }}
                expandable={{
                    expandedRowKeys,
                    defaultExpandAllRows: false,
                    onExpandedRowsChange: setExpandedRowKeys,
                }}
            />
        </div>
    );

};


export default FAQ;