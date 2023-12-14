import React, { useState } from 'react';
import {Upload, Button, Input, Select, Row, Col, Card, Space, Modal, message} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite'
import imageStore from '../../../store/ImgStore'
import '../css/ImageList.css'
import {getBase64} from "../../../utils/utils";


const ImageUpload = observer(() => {
    const [fileList, setFileList] = useState([]);
    const [imageInfo, setImageInfo] = useState({ title: '', road: '' });
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const handleFileChange = ({ fileList }) => setFileList(fileList);

    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleUpload = async () => {
        // 检查是否所有字段都已填写
        if (!imageInfo.title || !imageInfo.road) {
            message.warning('请填写所有必要信息后再上传！');
            return;
        }
        if (fileList.length === 0) {
            message.warning('请先选择图片后再上传！');
            return;
        }
        // 调用 store 的 uploadImages 方法
        await imageStore.uploadImages({ fileList, imageInfo });

        // 显示提示信息
        if (imageStore.uploadHint.status === 'success') {
            message.success(imageStore.uploadHint.message);
        } else if (imageStore.uploadHint.status === 'error') {
            message.error(imageStore.uploadHint.message);
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
        </div>
    );

    return (
        <Row gutter={24}>
            <Col span={18}>
                <Card style={{ height: '90vh', overflow: 'auto' }} >
                    <Upload
                        className="custom-upload"
                        listType="picture-card"
                        onChange={handleFileChange}
                        beforeUpload={() => false} // 阻止自动上传
                        fileList={fileList}
                        onPreview={handlePreview}
                        multiple={true}
                    >
                        {fileList.length >= 64 ? null : uploadButton}
                    </Upload>
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                        <img
                            alt="example"
                            style={{
                                width: '100%',
                            }}
                            src={previewImage}
                        />
                    </Modal>
                </Card>
            </Col>
            <Col span={6}>
                <Card title="图片信息填写" style={{ height: '90vh', overflow: 'auto', paddingBottom: '20px' }}>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <Input
                            placeholder="输入图片名称"
                            onChange={(e) => setImageInfo({ ...imageInfo, title: e.target.value })}
                        />
                        <Select
                            placeholder="选择道路"
                            style={{ width: '100%' }}
                            onChange={(value) => setImageInfo({ ...imageInfo, road: value })}
                        >
                            <Select.Option value="1">道路1</Select.Option>
                        </Select>
                    <Button type="primary"
                            style={{ width: '85%', position: 'absolute', bottom: '5vh' }}
                            onClick={handleUpload}
                            loading={imageStore.uploadHint.loading}
                    >
                        上传
                    </Button>
                    </Space>
                </Card>
            </Col>
        </Row>
    );
});

export default ImageUpload;
