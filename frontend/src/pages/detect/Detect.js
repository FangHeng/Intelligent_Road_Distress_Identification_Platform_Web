//  Detect.js: 检测记录页面
import {Badge, Card, Button, Select, Space, Tag, Progress, App, Skeleton} from 'antd';
import {PageContainer, ProList} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import userStore from "../../store/UserStore";
import historyStore from "../../store/HistoryStore";
import listIcon from "../../assets/icons/list.svg";
import imgStore from "../../store/ImgStore";
import {useNavigate} from "react-router-dom";
import {formatDateTime} from "../../utils/utils";

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

    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate();

    const {message} = App.useApp();

    const viewUpload = (uploadIdOrIds) => {
        historyStore.setCameFromDetect(true);
        imgStore.resetIsLastUploadIdFetched(false);
        // 如果 uploadIdOrIds 是数组，则直接赋值；如果是单个值，则转换为数组
        imgStore.selectedUploadId = Array.isArray(uploadIdOrIds) ? uploadIdOrIds : [uploadIdOrIds];
        navigate('/pages/visualize/ImgVisualize');
    }

    const fetchDataAndUpdate = () => {
        historyStore.fetchUploadRecords().then(() => {
            const data = historyStore.uploadRecords.map(item => ({
                id: item.upload_id,
                title: item.upload_name,
                road: item.road__road_name,
                subTitle: <Space><Tag color="geekblue">{item.road__road_name}</Tag><Tag
                    color="blue">{item.uploader__user__username}</Tag></Space>,
                actions: [
                    <Button key="delete" type="link"
                            onClick={() => historyStore.deleteUploadRecord(item.upload_id).then(
                                response => {
                                    if (response.success) {
                                        fetchDataAndUpdate();
                                        message.success(response.message);
                                    } else {
                                        message.error(response.message);
                                    }
                                }
                            )}>
                        删除
                    </Button>,

                    <Button key="view" type="link" onClick={() => viewUpload(item.upload_id)}>查看</Button>
                ],
                description: (
                    <div>
                        <div>共上传{item.upload_count}张照片</div>
                        <div>上传时间：{formatDateTime(item.upload_time)}</div>
                        <div>使用的模型：{item.selected_model}</div>
                    </div>
                ),
                avatar: listIcon,
                uploader: item.uploader__user__username,
                content: (
                    <div
                        style={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <div
                            style={{
                                width: 200,
                            }}
                        >
                            <div style={{marginBottom: '5px'}}>完好程度：</div>
                            <Progress percent={Math.round(parseFloat(item.integrity))}/>
                        </div>
                    </div>
                ),
            }));
            setIsLoading(false);
            setInitialData(data);
            setDataSource(data);
            setTotalRecords(data.length);
            setMyRecords(data.filter(item => item.uploader === userInfo.username).length);
            const roads = new Set(data.map(item => item.road));
            setRoadOptions(['全部', ...roads]);
        }).catch(error => {
            message.error('获取历史数据失败!');
        });
    };


    useEffect(() => {
        fetchDataAndUpdate();
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
        return active ? <Badge count={count} style={{marginLeft: 8}}/> : null;
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    const handleClick = () => {
        console.log('用户选择了:', selectedRowKeys);
        viewUpload(selectedRowKeys); // selectedRowKeys 是一个数组
    };

    const handleSelectAll = () => {
        setSelectedRowKeys(dataSource.map(item => item.id));
    };


    return (
        <App>
            <PageContainer
                header={{
                    title: '检测记录',
                }}
            >
                <Card style={{minHeight: '90vh'}}>
                {
                    isLoading ? <Skeleton active/> :
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
                                        style={{width: 200, marginLeft: 8}}
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
                                    <Button key="selectAll" onClick={handleSelectAll} type='link'>
                                        全选
                                    </Button>,
                                    selectedRowKeys.length ? (
                                        <Button key="customAction" onClick={handleClick} type='link'>
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
                                pageSize: 20,
                            }}
                        />
                }
                </Card>
            </PageContainer>
        </App>
    );
});

export default Detect;