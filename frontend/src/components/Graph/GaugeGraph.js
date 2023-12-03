
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Gauge } from '@ant-design/plots';
import {Card} from "antd";

const DemoGauge = () => {
    const config = {
        percent: 0.75,
        range: {
            ticks: [0, 1 / 3, 2 / 3, 1],
            color: ['#F4664A', '#FAAD14', '#30BF78'],
        },
        indicator: {
            pointer: {
                style: {
                    stroke: '#D0D0D0',
                },
            },
            pin: {
                style: {
                    stroke: '#D0D0D0',
                },
            },
        },
        statistic: {
            content: {
                style: {
                    fontSize: '36px',
                    lineHeight: '36px',
                },
            },
        },
    };
    return (
        <Card title="Card 2">
        <Gauge {...config} style={{
            height: '300px',
        }}/>
        </Card>
)
};

export default DemoGauge;
