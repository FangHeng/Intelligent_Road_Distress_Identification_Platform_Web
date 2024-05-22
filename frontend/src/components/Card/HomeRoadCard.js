// HomeRoadCard.js
import {HistoryOutlined, RightOutlined, ToTopOutlined} from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import {Button, Card, Collapse, Empty, Progress, Space, Tag, theme} from 'antd';
import {observer} from "mobx-react-lite";
import historyStore from "../../store/HistoryStore";
import {formatDateTime} from "../../utils/utils";
import {useNavigate} from "react-router-dom";

const HomeRoadCard = observer(() => {
    const { token } = theme.useToken();
    const navigate = useNavigate();
    const [defaultActiveKey, setDefaultActiveKey] = useState();
    const [sortedRecords, setSortedRecords] = useState([]);

    const panelStyle = {
        marginBottom: 12,
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: 'none',
    };


    const handleMoreClick = () => {
        navigate('/pages/detect/Detect')
    }

    const handleUploadClick = () => {
        navigate('/pages/detect/UploadPhoto')
    }

    useEffect(() => {
        if (historyStore.uploadRecords.length > 0) {
            const sorted = historyStore.uploadRecords
                .slice()
                .sort((a, b) => new Date(b.upload_time) - new Date(a.upload_time))
                .slice(0, 5);

            setSortedRecords(sorted);

            if (sorted.length > 0) {
                setDefaultActiveKey(sorted[0].upload_id);
            }
        }
    }, [historyStore.uploadRecords]);

    const getItems = (panelStyle) => {
        return sortedRecords.map(record => ({
            key: record.upload_id,
            label: (
                <Space>
                    <div>{record.upload_name}</div>
                    <Tag color="geekblue">{record.road__road_name}</Tag>
                </Space>
            ),
            children: (
                <div>
                    <p>上传者: {record.uploader__user__username}</p>
                    <p>上传时间: {formatDateTime(record.upload_time)}</p>
                    <p>上传数量: {record.upload_count}</p>
                    <p>使用的模型：{record.selected_model}</p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ whiteSpace: 'nowrap' }}>完好度: </span>
                        <Progress percent={Math.round(parseFloat(record.integrity))} style={{ marginLeft: 8 }} />
                    </div>
                </div>
            ),
            style: panelStyle,
        }));
    };


    return (
        <Card title='最近上传' className='firstRowCard' style={{ overflow: 'auto'}}>
            {
                defaultActiveKey !== undefined ? (
                    <>
                        <Collapse
                            bordered={false}
                            defaultActiveKey={defaultActiveKey}
                            expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 90 : 0} />}
                            style={{
                                background: token.colorBgContainer,
                            }}
                            items={getItems(panelStyle)}
                        />
                        <Button type="link" onClick={handleMoreClick} block><HistoryOutlined />
                            查看更多
                        </Button>
                    </>
                ) : (
                    <Empty>
                        <Button type="link" onClick={handleUploadClick} block><ToTopOutlined />
                            去上传
                        </Button>
                    </Empty>
                )
            }
        </Card>
    );
});
export default HomeRoadCard;