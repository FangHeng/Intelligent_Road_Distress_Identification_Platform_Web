import React, { useState } from 'react';
import {
    Card,
    Col,
    Row,
    Checkbox,
    Select,
    Image,
    Divider,
    Space,
    message,
    Modal,
    List,
    Segmented,
    Button,
    Drawer
} from 'antd';
import DecimalStep from "../../components/Slider/DecimalStep";
import '../detect/css/checkbox.css';
import {
    AppstoreOutlined,
    BarsOutlined,
    PictureOutlined,
    PlusOutlined,
    VerticalAlignBottomOutlined
} from "@ant-design/icons";
import image0 from '../../assets/cementation_fissures_0.jpg';
import image1 from '../../assets/cementation_fissures_1.jpg';
import './CSS/Visualize.css'


const { Option } = Select;

const ImgVisualize = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [previewVisible, setPreviewVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');

    const handleCardClick = (image) => {
        setSelectedImage(image);
        setPreviewImage(image.url);
        setPreviewVisible(true);
    };

    const handleCancel = () => {
        setPreviewVisible(false);
        setSelectedImage(null);
        setPreviewImage('');
    };

    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState('right');
    const showDrawer = () => {
        setOpen(true);
    };
    const onChange = (e) => {
        setPlacement(e.target.value);
    };
    const onClose = () => {
        setOpen(false);
    };


    // 处理Segmented选择变化
    const handleSegmentChange = (value) => {
        setViewMode(value === 'List' ? 'list' : 'grid');
    };

    const [photos, setPhotos] = useState([
        // 这里可以填入一些示例数据，例如：
        { id: 1, name: 'Image1.png', url: image0, date: '2023-04-01' },
        { id: 2, name: 'Image2.png', url: image1, date: '2023-04-02' }
    ]);

    const cardTitle = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>检测结果</span>
            <Segmented
                options={[
                    {
                        value: 'Kanban',
                        icon: <AppstoreOutlined />,
                    },
                    {
                        value: 'List',
                        icon: <BarsOutlined />,
                    },
                ]}
                onChange={handleSegmentChange}
            />
        </div>

    );

    const listView = (
        <List
            size="large"
            bordered
            dataSource={photos}
            renderItem={item => (
                <List.Item key={item.id} onClick={() => handleCardClick(item)} className="clickable-item">
                    <List.Item.Meta
                        avatar={item.url ? <img src={item.url} alt={item.name} style={{ width: '100px' }} /> : <PictureOutlined />}
                        title={item.name}
                        description={`上传日期：${item.date}`}
                    />
                    {/* 其他的元素和内容 */}
                </List.Item>
            )}
        />
    );

    const gridView = (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {photos.map(photo => (
                <Card
                    key={photo.id}
                    hoverable
                    style={{ width: 240, margin: '10px' }}
                    cover={<img alt={photo.name} src={photo.url} />}
                    onClick={() => handleCardClick(photo)}
                >
                    <Card.Meta title={photo.name} description={`上传日期：${photo.date}`} />
                </Card>
            ))}
        </div>
    );

    return (
        <Row gutter={24}>
            <Col span={18}>
                <Card title={cardTitle} style={{ height: '95vh', overflow: 'auto' }} >
                        {viewMode === 'grid' ? gridView : listView}
                </Card>
            </Col>
            <Modal
                open={previewVisible}
                title="图片预览与参数调整"
                width={800} // 设置一个更大的宽度以适应左右布局
                height={600}
                onCancel={handleCancel}
                footer={[
                        <Button key="confirm" onClick={handleCancel}>
                            确定
                        </Button>,
                    ]}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Image alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Col>
                    <Col span={12}>
                        <h3>{selectedImage ? selectedImage.name : '图片名称'}</h3>
                        <Divider /> {/* 这是一个简单的分割线 */}
                        <div>
                            <h4>阈值</h4>
                            <DecimalStep />
                            <h4>原始图像大小：</h4>
                            <h4>分块大小：</h4>
                            <h4>步长：</h4>
                            <h4>每个图像的分块数量：</h4>
                        </div>
                    </Col>
                </Row>
            </Modal>

            <Col span={6}>
                <Card title="调参面板" style={{ height: '95vh' }}>
                    <div className="threshold-label">阈值:<DecimalStep /></div>
                    {/*<Select defaultValue="upload" style={{ width: '100%', marginTop: '20px' }}>*/}
                    {/*    <Option value="upload">Upload Data</Option>*/}
                    {/*    /!* 其他选项 *!/*/}
                    {/*</Select>*/}
                    <div style={{ marginTop: '5px'}} className="threshold-label">预测展示：</div>
                    <Select defaultValue="all" style={{ width: '100%', marginTop: '20px' }}>
                        <Option value="all">所有预测图象</Option>
                        <Option value="disease">只有病害的图像</Option>
                        <Option value="normal">只有正常的图像</Option>
                    </Select>
                    <Divider></Divider>
                    <div className="threshold-label">图片类型：</div>
                    <Checkbox.Group style={{ width: '100%', marginTop: '20px' }} className="large-font-checkbox">
                        <Row>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Col span={24}>
                                    <Checkbox value="all">所有类型</Checkbox>
                                </Col>
                            </Space>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Col span={24}>
                                    <Checkbox value="other">其他</Checkbox>
                                </Col>
                            </Space>
                        </Row>
                    </Checkbox.Group>
                    <div style={{position: 'absolute', bottom: '5vh', width: '100%'}}>
                    <Space style={{ width: '100%', justifyContent: 'center', }} size='large'>
                        <Button type="primary"><VerticalAlignBottomOutlined />
                            导出结果
                        </Button>
                        <Button type="primary" onClick={showDrawer}>
                            <PlusOutlined />
                            下载报告
                        </Button>
                    </Space>
                        <Drawer
                            title="报告模板"
                            placement={placement}

                            onClose={onClose}
                            open={open}
                            size={'large'}
                            extra={
                                <Space>
                                    <Button onClick={onClose}>取消</Button>
                                    <Button type="primary" onClick={onClose}>
                                        确定
                                    </Button>
                                </Space>
                            }
                        >
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                        </Drawer>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default ImgVisualize;
