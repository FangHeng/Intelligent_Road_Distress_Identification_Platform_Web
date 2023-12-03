import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import {message, Upload, List, Image, Card} from 'antd';

const { Dragger } = Upload;

const UploadFolder = () => {
    const [fileList, setFileList] = useState([]);

    const props = {
        name: 'file',
        multiple: true,
        directory: true,
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        onChange(info) {
            const { status } = info.file;
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }

            // Filter out non-image files if you want to display only images
            const imageFiles = info.fileList.filter(file => file.type.startsWith('image/'));

            // Generate preview for image files
            setFileList(imageFiles.map(file => ({
                ...file,
                url: file.originFileObj ? URL.createObjectURL(file.originFileObj) : file.url,
            })));
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <Card title="文件夹上传" style={{ height: '90vh', overflow: 'auto' }} >
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件夹到此处</p>
                <p className="ant-upload-hint">
                    这里支持文件夹的上传。
                </p>
            </Dragger>
            <List
                itemLayout="horizontal"
                dataSource={fileList}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Image width={50} src={item.url} />}
                            title={item.name}
                            description={`Size: ${(item.size / 1024).toFixed(2)} KB`}
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default UploadFolder;
