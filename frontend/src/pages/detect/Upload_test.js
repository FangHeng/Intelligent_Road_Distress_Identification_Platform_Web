import React, { useState } from 'react';
import {Card, Col, Row, Slider, Checkbox, Select, Upload, Button, Divider, Space, message, Modal} from 'antd';
import {PlusOutlined, UploadOutlined} from '@ant-design/icons';
import DecimalStep from "../../components/Slider/DecimalStep";

const { Option } = Select;

const UploadPhoto = () => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null); // 新增状态来追踪当前选中的图像
    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async file => {
        setPreviewImage(file.thumbUrl);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        setPreviewVisible(true);
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传图片</div>
        </div>
    );


    return (
        <Row gutter={24}>
            <Col span={18}>
                <Card title="图片上传" style={{ height: '90vh', overflow: 'auto' }} >
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        beforeUpload={() => false} // 不上传文件，只选择
                        multiple={true} // 支持多文件选择
                    >
                        {uploadButton}
                    </Upload>
                </Card>
            </Col>
            <Modal
                open={previewVisible}
                title="图片预览与参数调整"
                width={800} // 设置一个更大的宽度以适应左右布局
                onCancel={handleCancel}
                footer={null} // 不需要底部按钮
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
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
                <Card title="调参面板" style={{ height: '90vh' }}>
                    <div>阈值:<DecimalStep /></div>
                    {/*<Select defaultValue="upload" style={{ width: '100%', marginTop: '20px' }}>*/}
                    {/*    <Option value="upload">Upload Data</Option>*/}
                    {/*    /!* 其他选项 *!/*/}
                    {/*</Select>*/}
                    <div style={{ marginTop: '5px'}}>预测展示：</div>
                    <Select defaultValue="all" style={{ width: '100%', marginTop: '20px' }}>
                        <Option value="all">所有预测图象</Option>
                        <Option value="disease">只有病害的图像</Option>
                        <Option value="normal">只有正常的图像</Option>
                    </Select>
                    <Divider></Divider>
                    <div>图片类型：</div>
                    <Checkbox.Group style={{ width: '100%', marginTop: '20px' }}>
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
                </Card>
            </Col>
        </Row>
    );
};

export default UploadPhoto;
