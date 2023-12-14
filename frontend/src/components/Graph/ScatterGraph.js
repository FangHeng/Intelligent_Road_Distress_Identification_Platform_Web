import { Scatter } from '@ant-design/plots';
import React from 'react';
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
        <Card bordered={false} className='secondRowColCard'>
            <Scatter {...config}
                containerStyle={{width: '100%', height: '30vh'}}
            />
        </Card>
    );
};

export default DemoScatter;
