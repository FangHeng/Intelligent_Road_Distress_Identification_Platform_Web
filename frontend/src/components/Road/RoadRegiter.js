import {Alert, AutoComplete, Button, Card, Cascader, Col, Form, message, Row, Space} from "antd";
import React, {useEffect, useState} from "react";
import initSettingMap from "../Graph/SettingMap";
import {Marker, Popup} from "@antv/l7";
import roadStore from "../../store/RoadStore";
import {observer} from "mobx-react-lite";
const rawData = require('../../assets/json/county.json');

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
const provinceOptions = Object.values(dataMap).map(province => ({
    ...province,
    children: Object.values(province.children)
}));

const RoadRegister = observer(() => {
    const [scene, setScene] = useState(null);
    const [region, setRegion] = useState('');
    const [keyword, setKeyword] = useState('');
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [extractedData, setExtractedData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentMarker, setCurrentMarker] = useState(null);

    // useEffect(() => {
    //     if (roadStore.hint.message) {
    //         switch (roadStore.hint.status) {
    //             case 'success':
    //                 message.success(roadStore.hint.message);
    //                 break;
    //             case 'error':
    //                 message.error(roadStore.hint.message);
    //                 break;
    //             case 'warning':
    //                 message.warning(roadStore.hint.message);
    //                 break;
    //             default:
    //                 message.info(roadStore.hint.message);
    //         }
    //     }
    // }, [roadStore.hint.message]);


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            position => {
                // 成功获取位置
                const { latitude, longitude } = position.coords;
                const mapScene =  initSettingMap(latitude, longitude);
                setScene(mapScene)
            },
            error => {
                // 错误处理
                console.error("Error acquiring position: ", error);
                const mapScene = initSettingMap(); // 使用默认位置
                setScene(mapScene)
            },
            () => {
                // 用户拒绝共享位置或获取位置失败
                const mapScene = initSettingMap(); // 使用默认位置
                setScene(mapScene)
            }
        );
    }, []);

    const handleCascaderChange = (value, selectedOptions) => {
        const province = selectedOptions[0] ? selectedOptions[0].label : '';
        const city = selectedOptions[1] ? selectedOptions[1].label : '';
        const district = selectedOptions[2] ? selectedOptions[2].label : '';
        roadStore.setSelectedRegion(province, city, district);

        if (selectedOptions[1]) {
            const city = selectedOptions[1].label;
            setRegion(city);
        } else {
            // 处理可能的异常情况，例如用户只选择了省级别
            setRegion('');
        }
    };

    const handleSearchChange = value => {
        setKeyword(value);
    };

    const search = async () => {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        var url = `/ws/place/v1/suggestion/?region=${encodeURIComponent(region)}&keyword=${encodeURIComponent(keyword)}&key=N3SBZ-L3BWL-36LPB-E7GSB-4BDAK-RFFTL`;

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.data && result.data.length) {
                    const newData = result.data.map(item => ({
                        id: item.id,
                        title: item.title,
                        category: item.category,
                        location: item.location
                    }));
                    setExtractedData(newData); // 更新状态
                }
            })
            .catch(error => {
                console.log('error', error);
                setExtractedData([]); // 发生错误时清空数据
            });
    };

    const roadOptions = extractedData.map(item => ({
        value: item.title,
        key: item.id,
        label: (
            <div>
                <strong>{item.title}</strong>
                <p>{item.category}</p>
            </div>
        )
    }));

    const handleSelect = value => {
        // 查找与所选 value 对应的项目
        const item = extractedData.find(item => item.title === value);
        if (item) {
            setSelectedItem(item);
            roadStore.setSelectedItem(item);
        }
    };

    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        setDebounceTimeout(setTimeout(() => {
            if (keyword) {
                search();
            }
        }, 500)); // 500毫秒的防抖时间

        return () => {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }
        };
    }, [keyword, region]);


    useEffect(() => {
        if (selectedItem && scene) {
            const {location} = selectedItem;
            // 移除旧的标记
            if (currentMarker) {
                scene.removeAllMarkers(currentMarker);
            }

            if (location) {
                // 更新地图中心
                scene.setZoomAndCenter(16, [location.lng, location.lat]);
                // 添加或更新标记
                const popup = new Popup({
                    offsets: [0, 20]
                }).setText(selectedItem.title);
                // 创建新的标记并添加到地图
                const newMarker = new Marker().setLnglat([location.lng, location.lat]).setPopup(popup);
                scene.addMarker(newMarker);
                // 更新当前标记的引用
                setCurrentMarker(newMarker);
            }
        }
    }, [selectedItem, scene]);

    const handleConfirmClick = () => {
        roadStore.saveData(
            () => {
                if (roadStore.hint.message) {
                    switch (roadStore.hint.status) {
                        case 'success':
                            message.success(roadStore.hint.message);
                            break;
                        case 'error':
                            message.error(roadStore.hint.message);
                            break;
                        case 'warning':
                            message.warning(roadStore.hint.message);
                            break;
                        default:
                            message.info(roadStore.hint.message);
                    }
                }
            }
        ); // 调用 MobX store 的保存动作
    };

    return (
        <>
            <Space direction="vertical" style={{width: '100%'}} size="large">
                <Alert
                    message='请先添加你上传图片的道路，以便统计和记录。'
                    type="info"
                    showIcon
                    closable
                />
                <Card style={{width: '100%', height: '20vh'}}>
                    <Form layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="请选择省市区：" required={true}>
                                    <Cascader
                                        style={{width: '100%'}}
                                        options={provinceOptions}
                                        onChange={handleCascaderChange}
                                        placeholder="请选择"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="请输入道路名：" required={true}>
                                    <AutoComplete
                                        options={roadOptions}
                                        style={{width: '100%'}}
                                        onSelect={handleSelect}
                                        onSearch={handleSearchChange}
                                        placeholder="输入关键词"
                                    />

                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                style={{width: '10vh'}}
                                onClick={handleConfirmClick}
                                loading={roadStore.isLoading}
                            >
                                确认
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                <div style={{height: "55vh", justifyContent:"center", position: "relative"}} id="settingMap"/>
            </Space>
        </>
    )
})

export default RoadRegister;

