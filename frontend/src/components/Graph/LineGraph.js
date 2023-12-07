import React from 'react';
import ReactDOM from 'react-dom';
import { Line } from '@ant-design/plots';
import {Card} from "antd";

const DemoLine = () => {
    const config = {
        data: {
            type: 'fetch',
            value: 'https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json',
        },
        xField: (d) => new Date(d.year),
        yField: 'value',
        sizeField: 'value',
        shapeField: 'trail',
        legend: { size: false },
        colorField: 'category',
    };
    return (
        <Card title="Line Chart" style={{ width: '100%' }}>
        <Line {...config}
            containerStyle={{width: '100%', height: '40vh'}}
        />
        </Card>
    );
};

export default DemoLine;
