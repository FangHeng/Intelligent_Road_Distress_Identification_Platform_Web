import React, {useRef, useState} from 'react';
import {Button, Input, message, Space, Table} from "antd";
import {DeleteOutlined, MonitorOutlined, SearchOutlined} from "@ant-design/icons";
import Highlighter from 'react-highlight-words';

const data = [
    {
        key: '1',
        uploadName: 'John Brown',
        rate: 32,
    },
    {
        key: '2',
        uploadName: 'Jim Green',
        rate: 42,
    },
    {
        key: '3',
        uploadName: 'Jim Green',
        rate: 42,
    },
    {
        key: '4',
        uploadName: 'Jim Green',
        rate: 42,
    }
];


const HistoryDetectTable = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    function handleDelete(uploadId) {
        console.log(uploadId)
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex, title) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`搜索 ${title}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        搜索
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        重置
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        过滤
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        关闭
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        columnWidth: '32px',
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
            {
                key: 'odd',
                text: '选择奇数行',
                onSelect: (changeableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                        if (index % 2 !== 0) {
                            return false;
                        }
                        return true;
                    });
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
            {
                key: 'even',
                text: '选择偶数行',
                onSelect: (changeableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                        if (index % 2 !== 0) {
                            return true;
                        }
                        return false;
                    });
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
        ],
    };

    const handleWatch = (uploadId) => {
        console.log(uploadId)
    }

    const columns = [
        {
            title: '上传名称',
            dataIndex: 'uploadName',
            key: 'uploadName',
            ...getColumnSearchProps('uploadName', '上传名称'),
        },
        {
            title: '病害率(%)',
            dataIndex: 'rate',
            key: 'rate',
        },
        {
            title :"操作",
            key : "action",
            width: '20%',
            render : (text, record) => (
                <Space size="small">
                    <Button danger type="link" onClick={() => handleDelete(record.key)}>
                        <DeleteOutlined />
                        删除
                    </Button>
                    <Button type="link"  onClick={() => handleWatch(record.key)}>
                        <MonitorOutlined/>
                        查看
                    </Button>
                </Space>
            )
        }
    ];

    // 处理按钮点击事件
    const handleButtonClick = () => {
        // 这里可以处理选中行的 ID，例如显示或发送到服务器
        console.log('Selected IDs:', selectedRowKeys);
        if (selectedRowKeys.length === 0){
            message.warning('请选择相应的记录！')
        }
        // 显示 ID 或执行其他操作
    };

    return (
        <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10 }}
            loading={data.length === 0}
            footer={() => (
                <div style={{ textAlign: 'right' }}>
                    <Button type="primary" onClick={handleButtonClick}>
                        <MonitorOutlined />
                        查看所有已选
                    </Button>
                </div>
            )}
        />
    )

};
export default HistoryDetectTable;