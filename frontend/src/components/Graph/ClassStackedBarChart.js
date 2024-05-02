import React, { useEffect } from 'react';
import { Chart } from '@antv/g2';
import {Card} from "antd";
import {classification_mapping} from "../../utils/utils";
import {observer} from "mobx-react-lite";
import imgStore from "../../store/ImgStore";
import {themeStore} from "../../store/ThemeStore";

export const processStackedData = (data) => {
    if (!data) {
        return [];
    }
    const stackedData = [];

    // 对每个 upload 计算分类的占比
    Object.entries(data).forEach(([uploadId, entry]) => {
        const { road_name, upload_name, files } = entry;
        const typeName = `${road_name}-${upload_name}`;
        const counts = {};

        // 初始化分类计数
        Object.keys(classification_mapping).forEach(classification => {
            counts[classification] = 0;
        });

        // 计算每个分类的数量
        files.forEach(file => {
            counts[file.classification_result]++;
        });

        // 转换为占比并添加描述性名称
        Object.entries(counts).forEach(([classification, count]) => {
            stackedData.push({
                typeName, // 使用描述性名称
                classification: classification_mapping[classification], // 使用分类的描述
                count: count,
            });
        });
    });

    return stackedData;
};

const wrapLabelAtDash = (label) => {
    return label.replace('-', '\n');
};


const ClassStackedBarGraph = observer(() => {
    const {resultData} = imgStore;
    const stackedChartData  = processStackedData(resultData);
    const {theme} = themeStore;

    useEffect(() => {
        const chart = new Chart({
            container: 'stackedDataContainer',
            autoFit: true,
        });

        chart.coordinate({transform: [{type: 'transpose'}]});

        // 使用处理过的数据
        chart
            .interval()
            .data(stackedChartData)
            .transform({type: 'stackY'})
            .transform({type: 'sortX', by: 'y', reverse: true})
            .transform({type: 'normalizeY'})
            .encode('x', 'typeName') // 使用 typeName 作为 x 轴的编码
            .encode('y', 'count') // 使用 count 作为 y 轴的编码
            .encode('color', 'classification') // 使用 classification 作为颜色的编码
            .style('maxWidth', 20)
            .axis(
                'y', {labelFormatter: '.0%'},
            ) // y 轴的标签格式化为百分比

            .tooltip({
                title: 'typeName',
                items: [{channel: 'y0', valueFormatter: '.0%'}, {channel: 'color' }]
            }) // 工具提示显示百分比
            .animate('enter', { type: 'scaleInX' });


        chart.theme({
            type: theme === 'dark' ? 'classicDark' : 'light',
        });
        chart.options({
            axis: {
                x:{
                    labelFormatter: wrapLabelAtDash,
                    title: '路段-上传'
                },
                y:{
                    title: '百分比'
                }

            },
        })

        chart.render();
    }, []);

    return (
        <Card title='堆叠条形图' >
            <div id="stackedDataContainer" style={{ height:'30vh' }}></div>
        </Card>
    );
});

export default ClassStackedBarGraph;