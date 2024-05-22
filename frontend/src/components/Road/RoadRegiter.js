// RoadRegister.js: 添加道路信息
import {Alert, AutoComplete, Button, Card, Cascader, Col, Form, Row, Space, Spin, App} from "antd";
import React, {useEffect, useState} from "react";
import initSettingMap from "../Graph/SettingMap";
import {Marker, Popup} from "@antv/l7";
import roadStore from "../../store/RoadStore";
import {observer} from "mobx-react-lite";
import provinceOptions from "../../utils/roadData";

const RoadRegister = observer(() => {
    const [scene, setScene] = useState(null); // 地图实例
    const [region, setRegion] = useState('');
    const [keyword, setKeyword] = useState('');
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [extractedData, setExtractedData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentMarker, setCurrentMarker] = useState(null);
    // 加载地图
    const [loading, setLoading] = useState(true);

    const [addRoad] = Form.useForm();

    const {message} = App.useApp();

    useEffect(() => {
        let mapScene;

        const onSuccess = position => {
            const { latitude, longitude } = position.coords;
            mapScene = initSettingMap(latitude, longitude);
            setLoading(false);
            setScene(mapScene);
            mapScene.render();
        };

        const onError = error => {
            console.error("Error acquiring position: ", error);
            mapScene = initSettingMap(); // 使用默认位置
            setLoading(false);
            setScene(mapScene);
            mapScene.render();
        };

        navigator.geolocation.getCurrentPosition(onSuccess, onError);

        // 组件卸载时的清理函数
        return () => {
            if (mapScene) {
                mapScene.destroy();
            }
        };
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
        var url = `/ws/place/v1/suggestion/?region=${encodeURIComponent(region)}&keyword=${encodeURIComponent(keyword)}&key=${process.env.REACT_APP_TENCENT_MAP_KEY}`;

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
                            addRoad.resetFields();
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
        <App>
                <Card style={{width: '100%'}}>
                    <Space direction="vertical" style={{width: '100%'}} size="large">
                    <Alert
                        message='请先添加你上传图片的道路，以便统计和记录。'
                        type="info"
                        showIcon
                        closable
                    />
                    <Form layout="vertical" name='addRoad' form={addRoad}>
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
                    <div style={{ height: "55vh", justifyContent: "center", position: "relative" }} id="settingMap">
                        {loading && (
                            <Spin className='spin'/>
                        )}
                    </div>
                    </Space>
                </Card>
        </App>
    )
})

export default RoadRegister;

