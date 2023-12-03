import React from 'react';
import ReactDOM from 'react-dom/client';

import {Card, Col, Row, Statistic} from "antd";
import DemoPie from "../../components/Graph/PieGraph";
import {ArrowDownOutlined, ArrowUpOutlined, LikeOutlined} from "@ant-design/icons";
import DemoGauge from "../../components/Graph/GaugeGraph";
import DemoBullet from "../../components/Graph/BulletGraph";
import DemoRadar from "../../components/Graph/RadarGraph";
import MindMapGraphGraph from "../../components/Graph/MindmapGraph";
import DemoDecompositionTreeGraph from "../../components/Graph/DecompasitionGraph";
import DemoLine from "../../components/Graph/LineGraph";

function Home() {
    return (
        <div style={{ margin: '20px' }}>
            <Row gutter={16}>
                {/* 第一行的卡片 */}
                <Col span={16}>
                    <DemoLine />
                </Col>
                <Col span={8}>
                    <DemoGauge />
                </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '20px' }}>
                <Col span={12}>
                    <DemoBullet />
                </Col>
                <Col span={12}>
                    <DemoRadar />
                </Col>
            </Row>
            {/*/!* 可以继续添加更多行和卡片 *!/*/}
        </div>
    );
}

export default Home;
