import {Alert, Button, Card, Cascader, Col, Form, Input, message, Row, Space} from "antd";
import React, {useEffect, useState} from "react";
import initSettingMap from "../../components/Graph/SettingMap";
const rawData = require('../../assets/county.json');
// 创建一个映射来存储转换后的数据
const dataMap = {};

// 遍历原始数据
rawData.forEach(item => {
    // 检查省份是否已经在映射中
    if (!dataMap[item.province]) {
        dataMap[item.province] = { value: item.province_adcode, label: item.province, children: {} };
    }

    // 检查城市是否已经在省份的映射中
    if (!dataMap[item.province].children[item.city]) {
        dataMap[item.province].children[item.city] = { value: item.city_adcode, label: item.city, children: [] };
    }

    // 添加区信息到城市的映射中
    dataMap[item.province].children[item.city].children.push({ value: item.county_adcode, label: item.county });
});

// 将映射转换为数组格式
const options = Object.values(dataMap).map(province => ({
    ...province,
    children: Object.values(province.children)
}));

const onChange = (value) => {
    console.log(value);
};

const AddRoad = () => {
    const [scene, setScene] = useState(null);
    useEffect(() => {
        const newScene = initSettingMap();
        setScene(newScene);
    }, []);

    return (
        <Card title="添加道路" style={{ height: '95vh' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Alert
                message='请先添加你上传图片的道路，以便统计和记录。'
                type="info"
                showIcon
                closable
            />
            <Card style={{ width: '100%', height: '20vh' }}>
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="请选择省市区：" required={true}>
                                <Cascader
                                    style={{ width: '100%' }}
                                    options={options}
                                    onChange={onChange}
                                    placeholder="请选择"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="请输入具体道路名称：" required={true}>
                                <Input placeholder="道路名称" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            style={{width: '10vh'}}
                        >
                            确认
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
                <div id="settingMap" style={{ width: '100%', height: '55vh' }} />
            </Space>
        </Card>
    )
}

export default AddRoad