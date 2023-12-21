import {Badge, Tag, Progress, Card, Button, Space, Select} from 'antd';
import { ProList } from '@ant-design/pro-components';
import {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import userStore from "../../store/UserStore";
import historyStore from "../../store/HistoryStore";

const Detect = observer(() => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [activeKey, setActiveKey] = useState('tab1');

    // 展示数量
    const [totalRecords, setTotalRecords] = useState(0);
    const [myRecords, setMyRecords] = useState(0);

    // 用于搜索
    const [searchValue, setSearchValue] = useState('');

    // 用于筛选
    const [roadOptions, setRoadOptions] = useState([]);
    const [selectedRoad, setSelectedRoad] = useState('');
    const [initialData, setInitialData] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const userInfo = userStore.userInfo;

    useEffect(() => {
        historyStore.fetchUploadRecords().then(loadedData => {
            setInitialData(loadedData);
            setDataSource(loadedData);
            setTotalRecords(loadedData.length);
            setMyRecords(loadedData.filter(item => item.uploader === userInfo.username).length);
            const roads = new Set(loadedData.map(item => item.road));
            setRoadOptions(['全部', ...roads]);
        });
    }, []);

    useEffect(() => {
        let filteredData = initialData;
        if (activeKey === 'tab1') {
            filteredData = initialData;
        } else if (activeKey === 'tab2') {
            filteredData = initialData.filter(item => item.uploader === userInfo.username);
        }

        if (searchValue) {
            filteredData = filteredData.filter(
                item =>
                    item.road.includes(searchValue) ||
                    item.uploader.includes(searchValue) ||
                    item.title.includes(searchValue)
            );
        }

        setDataSource(filteredData);
    }, [activeKey, searchValue, initialData]); // 确保这里包含了所有相关的依赖项

    // 初始时展开第一条数据
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    useEffect(() => {
        if (dataSource.length > 0) {
            setExpandedRowKeys([dataSource[0].id]);
        }
    }, [dataSource]);

    const handleRoadChange = value => {
        setSelectedRoad(value);
        if (value === '全部') {
            // 如果选择了“全部”，则不应用道路过滤
            setDataSource(initialData);
        } else {
            // 否则，只显示选择的道路
            const filteredData = initialData.filter(item => item.road === value);
            setDataSource(filteredData);
        }
    };


    const renderBadge = (count, active) => {
        return active ? <Badge count={count} style={{ marginLeft: 8 }} /> : null;
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    const handleClick = () => {
        // 处理自定义操作的函数
        console.log('自定义操作:', selectedRowKeys);
    };

    const handleSelectAll = () => {
        setSelectedRowKeys(dataSource.map(item => item.id));
    };


    return (
        <Card title='检测记录' style={{ height: '95vh', overflow: 'auto' }}>
            <ProList
                metas={{
                    title: {},
                    subTitle: {},
                    type: {},
                    description: {},
                    avatar: {},
                    content: {},
                    actions: {},
                }}
                toolbar={{
                    menu: {
                        activeKey,
                        items: [
                            {
                                key: 'tab1',
                                label: (
                                    <span>全部上传记录{renderBadge(totalRecords, activeKey === 'tab1')}</span>
                                ),
                            },
                            {
                                key: 'tab2',
                                label: (
                                    <span>
                                    我上传的记录{renderBadge(myRecords, activeKey === 'tab2')}
                                    </span>
                                ),
                            },
                        ],
                        onChange: (key) => setActiveKey(key),
                    },
                    actions: [
                        <Select
                            key="roadSelect"
                            showSearch
                            style={{ width: 200, marginLeft: 8 }}
                            placeholder="选择道路"
                            optionFilterProp="children"
                            onChange={handleRoadChange}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {roadOptions.map(road => (
                                <Select.Option key={road} value={road}>{road}</Select.Option>
                            ))}
                        </Select>,
                        <Button key="selectAll" onClick={handleSelectAll}>
                            全选
                        </Button>,
                        selectedRowKeys.length ? (
                            <Button key="customAction" onClick={handleClick}>
                                查看所选记录
                            </Button>
                        ) : null,
                    ],
                    search: {
                        onSearch: (value) => {
                            setSearchValue(value);
                        },
                    },
                }}
                rowKey="id"
                // headerTitle="预设的列状态"
                rowSelection={rowSelection}
                dataSource={dataSource}
                expandable={{
                    expandedRowKeys,
                    onExpandedRowsChange: setExpandedRowKeys,
                }}
                size={'large'}
                pagination={{
                    pageSize: 10,
                }}
            />
        </Card>
    );
});

export default Detect;