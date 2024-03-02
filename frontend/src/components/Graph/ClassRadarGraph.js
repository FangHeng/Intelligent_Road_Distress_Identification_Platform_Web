import imgStore from "../../store/ImgStore";
import {Card} from "antd";
import {Radar} from "@ant-design/plots";
import {observer} from "mobx-react-lite";
import React from "react";
import {classification_mapping} from "../../utils/utils";
import {themeStore} from "../../store/ThemeStore";

const processData = (data) => {
    const counts = {};

    // 初始化计数
    Object.entries(data).forEach(([uploadId, entry]) => {
        const { road_name, upload_name } = entry;
        const typeName = `${road_name}-${upload_name}`;
        Object.keys(classification_mapping).forEach(classification => {
            // 使用 classification 的文本描述作为 item
            const itemLabel = classification_mapping[classification];
            const countKey = `${typeName}-${itemLabel}`;
            counts[countKey] = { item: itemLabel, type: typeName, score: 0 };
        });
    });

    // 计算实际数量
    Object.entries(data).forEach(([uploadId, entry]) => {
        const { road_name, upload_name, files } = entry;
        const typeName = `${road_name}-${upload_name}`;
        files.forEach(file => {
            const { classification_result } = file;
            const itemLabel = classification_mapping[classification_result];
            const countKey = `${typeName}-${itemLabel}`;

            if (counts[countKey]) {
                counts[countKey].score += 1;
            }
        });
    });

    return Object.values(counts);
};


const ClassRadarGraph = observer(() => {
    const {resultData} = imgStore;

    const radarData = processData(resultData);

    console.log(radarData)

    const maxScore = Math.max(...radarData.map(item => item.score));

    const config = {
        data: radarData,
        xField: 'item',
        yField: 'score',
        colorField: 'type',
        shapeField: 'smooth',
        area: {
            style: {
                fillOpacity: 0.5,
            },
        },
        scale: { x: { align: 0 }, y: { tickCount: 5, domainMax: maxScore } },
        axis: { x: { grid: true }, y: { zIndex: 1, title: false } },
        style: {
            lineWidth: 2,
        },
        theme: themeStore.theme === 'dark' ? 'dark' : 'light',
    };
    return (
        <Card title="道路分类数量" style={{ width: '100%' }}>
            <Radar {...config}
                   containerStyle={{width: '100%', height: '30vh'}}
            />
        </Card>
    );
});

export default ClassRadarGraph;


