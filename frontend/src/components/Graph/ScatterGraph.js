import { Scatter } from '@ant-design/plots';
import React from 'react';
import ReactDOM from 'react-dom';
import {Card} from "antd";

const DemoScatter = () => {
    const config = {
        data: {
            type: 'fetch',
            value: 'https://gw.alipayobjects.com/os/antvdemo/assets/data/bubble.json',
        },
        xField: 'GDP',
        yField: 'LifeExpectancy',
        sizeField: 'Population',
        colorField: 'continent',
        shapeField: 'point',
        scale: {
            size: { type: 'log', range: [4, 20] },
        },
        style: { fillOpacity: 0.3, lineWidth: 1 },
    };
    return (
        <Card title="Scatter Chart" style={{ width: '100%' }}>
            <Scatter {...config}
                containerStyle={{width: '100%', height: '20vh'}}
            />
        </Card>
    );
};

export default DemoScatter;
