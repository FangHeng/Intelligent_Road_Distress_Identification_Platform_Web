import React, { useState } from 'react';
import {Upload, Modal, Input, Button, Card} from 'antd';
import {PlusOutlined, } from '@ant-design/icons';
import '../css/ImageList.css'

const ImageUploadPage = () => {
    const [fileList, setFileList] = useState([]);
    const [imageInfo, setImageInfo] = useState({}); // For storing image info and tags
    const [infoModalVisible, setInfoModalVisible] = useState(false); // For showing the info modal

    const handleCancel = () => {
        setInfoModalVisible(false);
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const beforeUpload = (file) => {
        // Show modal for user to enter image info and tags
        setInfoModalVisible(true);
        setImageInfo({ file: file }); // Temporarily save the file
        return false; // Prevent automatic upload
    };

    const handleInfoSubmit = () => {
        // Here you would handle the actual file upload manually
        // For example, you could append the info to FormData and send it to the server
        console.log('Uploading', imageInfo);

        // Hide modal and clear temp image info state
        setInfoModalVisible(false);
        setImageInfo({});
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
        </div>
    );

    return (
        <Card title='上传图片' style={{ height: '90vh', overflow: 'auto' }} >
            <Upload
                className="custom-upload"
                listType="picture-card"
                fileList={fileList}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                multiple={true}
            >
                {fileList.length >= 16 ? null : uploadButton}
            </Upload>
            <Modal
                title="Image Information"
                open={infoModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        返回
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleInfoSubmit}>
                        上传
                    </Button>,
                ]}
            >
                <Input
                    placeholder="Enter image title"
                    onChange={(e) => setImageInfo({ ...imageInfo, title: e.target.value })}
                />
                <Input
                    placeholder="Enter image tags"
                    onChange={(e) => setImageInfo({ ...imageInfo, tags: e.target.value.split(',') })}
                    style={{ marginTop: '1rem' }}
                />
            </Modal>
        </Card>
    );
};

export default ImageUploadPage;
