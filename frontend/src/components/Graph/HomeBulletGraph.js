import React from 'react';
import { Bullet } from '@ant-design/plots';
import {observer} from "mobx-react-lite";
import historyStore from "../../store/HistoryStore";
import {Card} from "antd";
import {themeStore} from "../../store/ThemeStore";

const HomeBulletGraph = observer(() => {
    const { uploadRecords } = historyStore;

    // 步骤1: 获取每条道路的最新记录
    const roadMap = new Map();
    uploadRecords.forEach(record => {
        const roadId = record.road__road_id;
        const existingRecord = roadMap.get(roadId);
        if (!existingRecord || new Date(record.upload_time) > new Date(existingRecord.upload_time)) {
            roadMap.set(roadId, record);
        }
    });

    // 步骤2: 筛选出完整性低于80的记录，并进行排序
    const sortedRecords = Array.from(roadMap.values())
        .filter(record => record.integrity < 80)
        .sort((a, b) => a.integrity - b.integrity)
        .slice(0, 5);

    // 步骤3: 准备子弹图数据
    const bulletData = sortedRecords.map(record => ({
        title: record.road__road_name,
        integrity: record.integrity,
        section: [50, 75, 100],
        score: [record.integrity],
        target: [95]
    }));

    // 子弹图颜色配置
    const color = {
        section: ['#bfeec8', '#FFe0b0', '#FFbcb8'], // 高、中、低完好度的颜色
        score: ['#5B8FF9'], // 实际值颜色
        target: '#f632f3', // 目标值颜色
    };

    // 子弹图配置
    const config = {
        data: bulletData,
        color,
        xField: 'title',
        rangeField: 'section',
        measureField: 'score',
        targetField: 'target',
        mapField: {
            section: ['优', '良', '差'],
            score: ['实际值'],
            target: ['目标值'],
        },
        theme: themeStore.theme === 'dark' ? 'dark' : 'light',
    };

    return (
        <Card title='根据检测结果值得关注的道路'>
            <Bullet {...config} containerStyle={{width: '100%', height: '45vh', minHeight: '450px' }}/>
        </Card>
    );
});

export default HomeBulletGraph;
