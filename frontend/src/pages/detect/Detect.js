import React, { useState } from 'react';
import {Card, Col, Row, Checkbox, Select, List, Divider, Space} from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import DecimalStep from "../../components/Slider/DecimalStep";
import * as PropTypes from "prop-types";
import './css/checkbox.css';

const { Option } = Select;

function CheckboxGroup(props) {
    return null;
}

CheckboxGroup.propTypes = {
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.any),
    value: PropTypes.arrayOf(PropTypes.any)
};
const Detect = () => {
    // 假设这是从后端获取的历史记录数据
    const [records, setRecords] = useState([
        // 这里可以填入一些示例数据，例如：
        { id: 1, name: 'Image1.png', date: '2023-04-01' },
        { id: 2, name: 'Image2.png', date: '2023-04-02' }
    ]);

    const [checkedList, setCheckedList] = useState([]);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);

    const options = [
        '正常', '横向裂缝', '巨大裂缝', '鳄鱼裂缝',
        '浇注裂缝', '纵向裂缝', '修补', '开槽'
    ];

    const onCheckAllChange = e => {
        setCheckedList(e.target.checked ? options : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };

    const onCheckboxChange = list => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < options.length);
        setCheckAll(list.length === options.length);
    };


    return (
        <Row gutter={24}>
            <Col span={18}>
                <Card title="历史记录" style={{ height: '90vh', overflow: 'auto' }} >
                    <List
                        size="large"
                        bordered
                        dataSource={records}
                        renderItem={item => (
                            <List.Item key={item.id}>
                                <List.Item.Meta
                                    avatar={<PictureOutlined />}
                                    title={item.name}
                                    description={`上传日期：${item.date}`}
                                />
                                {/* 这里可以添加更多关于记录的信息 */}
                            </List.Item>
                        )}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card title="调参面板" style={{ height: '90vh' }}>
                    <div className="threshold-label">阈值:<DecimalStep /></div>
                    <div style={{ marginTop: '5px'}} className="threshold-label">预测展示：</div>
                    <Select defaultValue="all" style={{ width: '100%', marginTop: '20px' }}>
                        <Option value="all">所有预测图象</Option>
                        <Option value="disease">只有病害的图像</Option>
                        <Option value="normal">只有正常的图像</Option>
                    </Select>
                    <Divider />
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <div style={{ marginBottom: '10px' }} className="threshold-label">图片类型：</div>
                        <Checkbox
                            indeterminate={indeterminate}
                            onChange={onCheckAllChange}
                            checked={checkAll}
                            className="large-font-checkbox-item"
                        >
                            所有类型
                        </Checkbox>
                    </Space>
                    <div style={{ marginBottom: '10px' }}></div>
                    <Checkbox.Group value={checkedList} onChange={onCheckboxChange} style={{ width: '100%' }} className="large-font-checkbox">
                        {options.map((value, index) => (
                            <Space key={index} direction="vertical" style={{ width: '100%' }}>
                                <Checkbox value={value}>
                                    {value}
                                </Checkbox>
                            </Space>
                        ))}
                    </Checkbox.Group>
                </Card>
            </Col>
        </Row>
    );
};

export default Detect;
