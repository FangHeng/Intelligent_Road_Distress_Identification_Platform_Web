import React from 'react';
import { Bullet } from '@ant-design/plots';
import {observer} from "mobx-react-lite";
import imgStore from "../../store/ImgStore";
import historyStore from "../../store/HistoryStore";
import {getProcessedData} from "./RoadWithTimeGraph";
import {Card} from "antd";

const getMostRecentRecordForRoad = (records) => {
    return records.reduce((latest, current) => {
        const latestDate = new Date(latest.upload_time);
        const currentDate = new Date(current.upload_time);
        return latestDate > currentDate ? latest : current;
    });
}

const IntegrityBulletGraph = observer(() => {
    const {resultData} = imgStore;
    const {uploadRecords} = historyStore;
    const dataForGraph = getProcessedData(resultData, uploadRecords);

        // 使用Map来聚合每条道路的完好度测量值
        const roadMap = new Map();
        dataForGraph.forEach(record => {
            const road = record.road_name;
            const existingRecord = roadMap.get(road);
            const mostRecentRecord = existingRecord
                ? getMostRecentRecordForRoad([existingRecord, record])
                : record;
            roadMap.set(road, mostRecentRecord);
        });

        const bulletData = Array.from(roadMap.values()).map(record => {
            return {
                title: record.road_upload_name,
                integrity: record.integrity,
                section: [50, 75, 100],
                score: [record.integrity],
                target: [95]
            };
        });

        const color = {
            section: ['#bfeec8', '#FFe0b0', '#FFbcb8'], // 高、中、低完好度的颜色
            score: ['#5B8FF9'], // 实际值颜色
            target: '#f632f3', // 目标值颜色
        };

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
        };

        return (
            <Card title='预期完好程度差距'>
                <Bullet {...config} containerStyle={{width: '100%', height: '40vh'}} />
            </Card>
        )
    });

export default IntegrityBulletGraph;
