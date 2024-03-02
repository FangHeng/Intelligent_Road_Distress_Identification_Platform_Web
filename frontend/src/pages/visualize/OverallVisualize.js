// OverallVisualize.js: 整体可视化页面，包括道路完好随时间变化，道路最近一次与目标完好度差距，破损分类情况等。
import React, {useEffect, useState} from 'react';
import {App, Button, Col, Row, Spin} from "antd";
import ClassRadarGraph from "../../components/Graph/ClassRadarGraph";
import historyStore from "../../store/HistoryStore";
import imgStore from "../../store/ImgStore";
import ClassStackedBarGraph from "../../components/Graph/ClassStackedBarChart";
import RoadWithTimeGraph from "../../components/Graph/RoadWithTimeGraph";
import IntegrityBulletGraph from "../../components/Graph/IntegrityBulletGraph";
import {PageContainer} from "@ant-design/pro-components";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {HistoryOutlined} from "@ant-design/icons";

const OverallVisualize = observer(() => {
    const {message} = App.useApp();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (imgStore.selectedUploadId.length === 0 || imgStore.resultData.length === 0) {
                const fetchData = async () => {
                    setIsLoading(true);
                    if (!historyStore.cameFromDetect) {
                        try {
                            const lastUploadId = await imgStore.fetchLastUploadId();
                            if (lastUploadId) {
                                await imgStore.fetchResultData([lastUploadId]);
                                await historyStore.fetchUploadRecords();
                            }
                        } catch (error) {
                            console.error("Error during data fetching:", error);
                        }
                    }
                    setIsLoading(false);
                }
                fetchData().catch(error => {
                    message.error('获取数据失败！');
                });
            }
    }, []);

    return (
        // 通过isLoading来判断是否显示spin还是数据
        <App>
            <PageContainer
                header={{
                    title: '整体可视化',
                    ghost: true,
                    extra: [
                        <Button key="1" type='link' onClick={() => navigate('/pages/detect/Detect')}>
                            <HistoryOutlined />
                            去历史记录选择</Button>,
                    ],
                }}
                content='整体可视化展示了当前道路的整体情况，包括道路完好随时间变化，道路最近一次与目标完好度差距，破损分类情况等。'
            >
                {isLoading ?
                    <Spin className={'spin'} size='large' style={{ marginTop: '100px' }}/>
                     :
                    <>
                        <Row gutter={16}>
                            {/* 第一行的卡片 */}
                            <Col xs={24} sm={24} md={24} lg={12} className='responsive-col'>
                                <RoadWithTimeGraph/>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={12} className='responsive-col'>
                                <IntegrityBulletGraph/>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24} sm={24} md={24} lg={12} className='responsive-col'>
                                <ClassStackedBarGraph/>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={12} className='responsive-col'>
                                <ClassRadarGraph/>
                            </Col>
                        </Row>
                    </>
                }
                {/*/!* 可以继续添加更多行和卡片 *!/*/}
            </PageContainer>
        </App>
    );
});

export default OverallVisualize;
