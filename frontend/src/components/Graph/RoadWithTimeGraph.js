import imgStore from "../../store/ImgStore";
import historyStore from "../../store/HistoryStore";
import { Chart } from '@antv/g2';
import {observer} from "mobx-react-lite";
import React, {useEffect} from "react";
import {Card} from "antd";
import {formatDateTime} from "../../utils/utils";

export function getProcessedData(resultData, uploadRecords) {
    let processedData = [];

    for (let uploadId in resultData) {
        let foundRecord = uploadRecords.find(record => record.upload_id === uploadId);

        if (foundRecord) {
            // 将字符串转换为数值，然后四舍五入到两位小数
            const integrityValue = parseFloat(foundRecord.integrity);
            const roundedIntegrity = isNaN(integrityValue) ? 0 : Math.round(integrityValue * 100) / 100;
            processedData.push({
                upload_time: formatDateTime(foundRecord.upload_time, false), // 只显示月、日、时、分
                road_name: foundRecord.road__road_name, // 可以考虑缩短或使用缩写
                upload_name: foundRecord.upload_name, // 可以考虑缩短或使用缩写
                integrity: roundedIntegrity, // 完好度
                timeAndRoad: `${formatDateTime(foundRecord.upload_time, false)} ${foundRecord.road__road_name} ${foundRecord.upload_name}`, // 组合字段
                road_upload_name: `${foundRecord.road__road_name} ${foundRecord.upload_name}` // 组合字段
            });
        }
    }

    // 按时间排序
    processedData.sort((a, b) => new Date(a.upload_time) - new Date(b.upload_time));

    return processedData;
}

const RoadWithTimeGraph = observer(() => {
    const {resultData} = imgStore;
    const {uploadRecords} = historyStore;
    const dataForGraph  = getProcessedData(resultData, uploadRecords);

    useEffect(() => {
        const chart = new Chart({
            container: 'LineContainer',
            autoFit: true,
        });

        chart
            .data(dataForGraph)
            .encode('x', 'upload_time')
            .encode('y', 'integrity')
            .encode('color', 'road_name')
            .scale('upload_time', {
                type: 'time', // 标记这是时间数据
            })
            .scale('y', {
                min: 0, // 最小值
                max: 100, // 最大值，
            })
            .axis('x', {
                title: '时间'
            })
            .axis('y', {
                title: '完好度（%）', // 设置纵坐标标题为“完好度”
                labelFormatter: (d) => `${d}` // 设置纵坐标标签格式为百分数
            });

        chart.line().encode('shape', 'smooth');

        chart.point().encode('shape', 'point').tooltip(false);

        chart.render();
    }, [dataForGraph]); // 添加 dataForGraph 作为 useEffect 的依赖

    return (
        <Card title='道路完好度随时间变化'>
            <div id="LineContainer" style={{ height: '40vh' }}></div>
        </Card>
    );
});


export default RoadWithTimeGraph;
