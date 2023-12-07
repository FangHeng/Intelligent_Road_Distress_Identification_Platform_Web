import React from 'react';
import {Col, Row} from "antd";
import DemoGauge from "../../components/Graph/GaugeGraph";
import DemoRadar from "../../components/Graph/RadarGraph";
import DemoLine from "../../components/Graph/LineGraph";
import DemoBullet from "../../components/Graph/BulletGraph";
function Home() {
    return (
        <div>
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
