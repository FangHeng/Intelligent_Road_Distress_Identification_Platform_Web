import {Segmented, Card} from "antd";
import React, {useState} from "react";
import {observer} from "mobx-react-lite";
import {OrderedListOutlined, PlusCircleOutlined,} from "@ant-design/icons";
import RoadRegister from "../../components/Road/RoadRegiter";
import HistoryRoad from "../../components/Road/HistoryRoad";


const AddRoad = observer(() => {

    const [viewMode, setViewMode] = useState('new');

    const handleSegmentChange = (value) => {
        setViewMode(value === 'new' ? 'new' : 'history');
    };

    const cardTitle = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>添加道路</span>
            <Segmented
                options={[
                    {
                        value: 'new',
                        icon: <PlusCircleOutlined />,
                    },
                    {
                        value: 'history',
                        icon: <OrderedListOutlined />,
                    },
                ]}
                onChange={handleSegmentChange}
            />
        </div>
    );

    return (
        <Card title={cardTitle} style={{ height: '95vh', overflow: 'True' }} >
            {viewMode === 'new' ? <RoadRegister /> : <HistoryRoad />}
        </Card>
    )
});

export default AddRoad