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
import Loader from "../../components/Loader/Loader";
import axiosInstance from "../../utils/AxiosInstance";

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
    const [selectedRoad, setSelectedRoad] = useState('全部');
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
                subTitle: (
                    <Space>
                        <Tag color="geekblue">{item.road__road_name}</Tag>
                        <Tag color="blue">{item.uploader__user__username}</Tag>
                    </Space>
                ),
                actions: [
                    <Button
                        key="delete"
                        type="link"
                        onClick={() =>
                            historyStore.deleteUploadRecord(item.upload_id).then(response => {
                                if (response.success) {
                                    fetchDataAndUpdate();
                                    message.success(response.message);
                                } else {
                                    message.error(response.message);
                                }
                            })
                        }
                        // disabled={item.integrity === -1}
                    >
                        删除
                    </Button>,
                    <Button key="view" type="link" onClick={() => viewUpload(item.upload_id)} disabled={item.integrity === -1}>
                        查看
                    </Button>,
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
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        {item.integrity === -1 ? (
                            <Loader />
                        ) : (
                            <div style={{ width: 200 }}>
                                <div style={{ marginBottom: '5px' }}>完好程度：</div>
                                <Progress percent={Math.round(parseFloat(item.integrity))} />
                            </div>
                        )}
                    </div>
                ),
            }));
            setIsLoading(false);
            setInitialData(data);
            setDataSource(data);
            // 更新totalRecords和myRecords
            setTotalRecords(data.length);
            setMyRecords(data.filter(item => item.uploader === userInfo.username).length);
            const roads = new Set(data.map(item => item.road));
            setRoadOptions(['全部', ...roads]);
        }).catch(error => {
            message.error('获取历史数据失败!');
        });
    };

    const handleTabChange = (key) => {
        setActiveKey(key);
        // 更新totalRecords和myRecords
        if (key === 'tab1') {
            const filteredData = applyFilters(initialData);
            setTotalRecords(filteredData.length);
            setDataSource(filteredData);
        } else if (key === 'tab2') {
            const filteredData = applyFilters(initialData).filter(item => item.uploader === userInfo.username);
            setMyRecords(filteredData.length);
            setDataSource(filteredData);
        }
    };

    const applyFilters = (data) => {
        let filteredData = data;

        // 根据搜索值过滤
        if (searchValue) {
            filteredData = filteredData.filter(
                item =>
                    item.road.includes(searchValue) ||
                    item.uploader.includes(searchValue) ||
                    item.title.includes(searchValue)
            );
        }

        // 根据选择的道路过滤
        if (selectedRoad !== '全部') {
            filteredData = filteredData.filter(item => item.road === selectedRoad);
        }

        return filteredData;
    };

    // 刷新时导致用户信息加载没有完成，导致userInfo为空，重新计算myRecords
    useEffect(() => {
        setMyRecords(dataSource.filter(item => item.uploader === userInfo.username).length);
    }, [userInfo, dataSource]);


    useEffect(() => {
        fetchDataAndUpdate();
    }, []);

    useEffect(() => {
        if (historyStore.cameFromUpload) {
            const intervalId = setInterval(() => {
                // 查找 dataSource 中 integrity 为 -1 的记录
                const pendingUploads = historyStore.uploadRecords.filter(item => item.integrity === -1);
                console.log('pendingUploads', pendingUploads)
                // 如果有待处理的记录，则向后端发送请求检查处理状态
                if (pendingUploads.length > 0) {
                    const uploadIds = pendingUploads.map(item => item.upload_id);
                    // console.log('Checking upload status:', uploadIds)
                    const params = new URLSearchParams();
                    uploadIds.forEach(id => params.append('upload_id', id));
                    // 发送请求
                    axiosInstance.get('/irdip/check_upload_status/', { params })
                        .then(response => {
                            const statusDict = response.data;
                            // 对于每个记录，检查处理状态
                            pendingUploads.forEach(upload => {
                                const uploadId = upload.upload_id;
                                if (statusDict[uploadId]) {
                                    // 如果处理完全，执行 fetchDataAndUpdate
                                    fetchDataAndUpdate();
                                    message.success(`${upload.upload_name} 处理成功！`);
                                }
                            });
                            // 检查所有记录的状态是否都为 true
                            const allUploaded = pendingUploads.every(upload => statusDict[upload.upload_id]);
                            if (allUploaded) {
                                // 如果所有记录的状态都为 true，则将 cameFromUpload 置为 false
                                historyStore.setCameFromUpload(false);
                            }
                        })
                        .catch(error => {
                            console.error('Error checking upload status:', error);
                        });
                }
            }, 5000); // 10 seconds in milliseconds

            // 在组件卸载时清除定时器
            return () => clearInterval(intervalId);
        }
    }, [historyStore.cameFromUpload, dataSource]);


    // useEffect(() => {
    //     let filteredData = initialData;
    //     if (activeKey === 'tab1') {
    //         filteredData = initialData;
    //     } else if (activeKey === 'tab2') {
    //         filteredData = initialData.filter(item => item.uploader === userInfo.username);
    //     }
    //
    //     if (searchValue) {
    //         filteredData = filteredData.filter(
    //             item =>
    //                 item.road.includes(searchValue) ||
    //                 item.uploader.includes(searchValue) ||
    //                 item.title.includes(searchValue)
    //         );
    //     }
    //
    //     setDataSource(filteredData);
    // }, [activeKey, searchValue, initialData]); // 确保这里包含了所有相关的依赖项
    // const handleSearch = (value) => {
    //     setSearchValue(value);
    //     // 根据搜索值过滤数据并更新totalRecords和myRecords
    //     const filteredData = initialData.filter(
    //         item =>
    //             item.road.includes(value) ||
    //             item.uploader.includes(value) ||
    //             item.title.includes(value)
    //     );
    //     setDataSource(filteredData);
    //
    //     // 更新totalRecords和myRecords
    //     if (activeKey === 'tab1') {
    //         setTotalRecords(filteredData.length);
    //     } else if (activeKey === 'tab2') {
    //         setMyRecords(filteredData.filter(item => item.uploader === userInfo.username).length);
    //     }
    // };
    const handleRoadChange = value => {
        setSelectedRoad(value);
        filterData(value, searchValue);
    };

    const handleSearch = (value) => {
        setSearchValue(value);
        filterData(selectedRoad, value);
    };

    const filterData = (road, search) => {
        let filteredData = initialData;

        console.log('road:', road);
        console.log('search:', search);

        // 根据道路过滤
        if (road !== '全部') {
            filteredData = filteredData.filter(item => item.road === road);
        }

        // 根据搜索值过滤
        if (search) {
            filteredData = filteredData.filter(
                item =>
                    item.road.includes(search) ||
                    item.uploader.includes(search) ||
                    item.title.includes(search)
            );
        }

        // 更新数据源
        setDataSource(filteredData);

        // 更新totalRecords和myRecords
        setTotalRecords(filteredData.length);
        setMyRecords(filteredData.filter(item => item.uploader === userInfo.username).length);
    };



    // 初始时展开第一条数据
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    useEffect(() => {
        if (dataSource.length > 0) {
            setExpandedRowKeys([dataSource[0].id]);
        }
    }, [dataSource]);

    // const handleRoadChange = value => {
    //     setSelectedRoad(value);
    //     if (value === '全部') {
    //         // 如果选择了“全部”，则不应用道路过滤
    //         setDataSource(initialData);
    //
    //         // 更新totalRecords和myRecords
    //         setTotalRecords(initialData.length);
    //         setMyRecords(initialData.filter(item => item.uploader === userInfo.username).length);
    //     } else {
    //         // 否则，只显示选择的道路
    //         const filteredData = initialData.filter(item => item.road === value);
    //         setDataSource(filteredData);
    //
    //         // 更新totalRecords和myRecords
    //         setTotalRecords(filteredData.length);
    //         setMyRecords(filteredData.filter(item => item.uploader === userInfo.username).length);
    //     }
    // };

    const renderBadge = (count, active = false) => {
        return (
            <Badge
                count={count}
                style={{
                    marginBlockStart: -2,
                    marginInlineStart: 4,
                    color: active ? '#ffffff' : '#999',
                    backgroundColor: active ? 'red' : '#eee',
                }}
            />
        );
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
                                tableAlertRender={({selectedRowKeys, selectedRows}) => {
                                    return (
                                        <Space size={16}>
                                            <span>已选择 <a style={{fontWeight: 600}}>{selectedRowKeys.length}</a> 项</span>
                                            <span>总共 <a style={{fontWeight: 600}}>{dataSource.length}</a> 项</span>
                                        </Space>
                                    );
                                }}
                                tableAlertOptionRender={() => {
                                    return (
                                        <Space size={16}>
                                            {/*取消选择*/}
                                            <Button type='link' onClick={() => setSelectedRowKeys([])}>取消选择</Button>
                                            <Button key="customAction" onClick={handleClick} type='link'>
                                                查看所选记录
                                            </Button>
                                        </Space>
                                    );
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
                                        onChange: handleTabChange,
                                    },
                                    actions: [
                                        <Select
                                            key="roadSelect"
                                            showSearch
                                            style={{width: 200, marginLeft: 8}}
                                            placeholder="选择道路"
                                            optionFilterProp="children"
                                            value={selectedRoad} // 使用selectedRoad作为当前选中的值
                                            onChange={handleRoadChange}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {roadOptions.map(road => (
                                                <Select.Option key={road} value={road}>{road}</Select.Option>
                                            ))}
                                        </Select>,
                                        <Button key="selectAll" onClick={handleSelectAll} type='primary'>
                                            全选
                                        </Button>,
                                    ],
                                    search: {
                                        filterType: 'light',
                                        onSearch: handleSearch,
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
                                    defaultPageSize: 10,
                                    showQuickJumper: true,
                                    showSizeChanger: true,
                                }}

                            />
                    }
                </Card>
            </PageContainer>
        </App>
    );
});

export default Detect;