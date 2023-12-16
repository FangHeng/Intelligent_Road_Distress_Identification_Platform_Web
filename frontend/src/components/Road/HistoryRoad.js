import React, {useEffect, useState} from "react";
import roadStore from "../../store/RoadStore";
import {observer} from "mobx-react-lite";
import {Alert, Space, Table} from "antd";

const columns = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    },
    {
        title: '道路名称',
        dataIndex: 'road_name',
        key: 'road_name',
    },
    {
        title: 'GPS经度',
        dataIndex: 'gps_longitude',
        key: 'gps_longitude',
    },
    {
        title: 'GPS纬度',
        dataIndex: 'gps_latitude',
        key: 'gps_latitude',
    },
    {
        title: '行政省份',
        dataIndex: 'administrative_province',
        key: 'administrative_province',
    },
    {
        title: '行政市',
        dataIndex: 'administrative_city',
        key: 'administrative_city',
    },
    {
        title: '行政区',
        dataIndex: 'administrative_district',
        key: 'administrative_district',
    },
];


const HistoryRoad = (observer(() => {
    const [formattedRoadData, setFormattedRoadData] = useState([]);

    useEffect(() => {
        roadStore.getRoadData(); // 获取道路数据
    }, []);

    useEffect(() => {
        // 当道路数据更新时，添加顺序编号
        const dataWithIndex = roadStore.roadData.map((road, index) => ({
            key: index, // 添加唯一的 key
            index: index + 1, // 生成顺序编号，从 1 开始
            ...road
        }));
        setFormattedRoadData(dataWithIndex);
    }, [roadStore.roadData]);


    return(
        <div style={{width:'100%'}}>
            <Space style={{width:'100%'}} direction="vertical" size={"large"}>
            <Alert
                message="以下是你们公司已经记录在我们的系统中的道路信息，请不要重复注册。"
                type="warning"
                showIcon
                closable
            />
                <Table
                    dataSource={formattedRoadData}
                    columns={columns}
                    pagination={{ pageSize: 10 }} // 设置每页显示10条数据
                />
            </Space>
        </div>
    )
    }))


export default HistoryRoad
