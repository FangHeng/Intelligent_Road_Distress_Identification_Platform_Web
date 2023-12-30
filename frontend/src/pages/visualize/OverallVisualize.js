import React, {useEffect, useState} from 'react';
import {Col, Row, Spin} from "antd";
import ClassRadarGraph from "../../components/Graph/ClassRadarGraph";
import historyStore from "../../store/HistoryStore";
import imgStore from "../../store/ImgStore";
import ClassStackedBarGraph from "../../components/Graph/ClassStackedBarChart";
import RoadWithTimeGraph from "../../components/Graph/RoadWithTimeGraph";
import IntegrityBulletGraph from "../../components/Graph/IntegrityBulletGraph";

const OverallVisualize = () => {
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        console.log(imgStore.isLastUploadIdFetched)
        if (imgStore.selectedUploadId.length === 0) {
            const fetchData = async () => {
                setIsLoading(true);
                if (!historyStore.cameFromDetect) {
                    try {
                        const lastUploadId = await imgStore.fetchLastUploadId();
                        if (lastUploadId) {
                            await imgStore.fetchResultData([lastUploadId]);
                        }
                    } catch (error) {
                        console.error("Error during data fetching:", error);
                    }
                }
                setIsLoading(false);
            };

            fetchData();
        }
    }, []);

    return (
        // 通过isLoading来判断是否显示spin还是数据
        isLoading ? <Spin className='spin' /> :
        <div>
            <Row gutter={16}>
                {/* 第一行的卡片 */}
                <Col span={12}>
                    <RoadWithTimeGraph />
                </Col>
                <Col span={12}>
                    <IntegrityBulletGraph />
                </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '20px' }}>
                <Col span={12}>
                    <ClassStackedBarGraph />
                </Col>
                <Col span={12}>
                    <ClassRadarGraph />
                </Col>
            </Row>
            {/*/!* 可以继续添加更多行和卡片 *!/*/}
        </div>
    );
}

export default OverallVisualize;
