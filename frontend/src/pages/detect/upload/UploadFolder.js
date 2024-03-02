// UploadFolder.js: 上传文件夹组件，用于上传文件夹中的图片
import React, { useState } from 'react';
import {InboxOutlined, VerticalAlignTopOutlined} from '@ant-design/icons';
import {message, Upload, Spin, Space, Input, Select, Button, Descriptions} from 'antd';
import {ProCard} from "@ant-design/pro-components";
import imageStore from "../../../store/ImgStore";
import roadStore from "../../../store/RoadStore";
import RcResizeObserver from "rc-resize-observer";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";

const { Dragger } = Upload;

const UploadFolder = observer(() => {
    const [fileList, setFileList] = useState([]);
    const [responsive, setResponsive] = useState(false);
    const [imageInfo, setImageInfo] = useState({title: '', road: ''});

    const navigate = useNavigate();

    const props = {
        name: 'file',
        multiple: true,
        directory: true,
        onChange(info) {
            setFileList(info.fileList);
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        showUploadList: false, // 禁用默认的上传列表显示
    };

    // 自定义文件列表显示
    const renderFileList = () => {
        return (
            <div style={{ marginTop: '1vh' }}>
                <Descriptions title="已选择文件" column={1} size="small">
                    <Descriptions.Item label="文件数量">{fileList.length}</Descriptions.Item>
                    <Descriptions.Item label="文件">
                        <div style={{ maxHeight: '20vh', overflow: 'auto' }}>
                            {fileList.map((file) => (
                                <Space>
                                    <span key={file.uid} style={{ marginRight: '2px' }}>{file.name}</span>
                                </Space>

                            ))}
                        </div>
                    </Descriptions.Item>
                </Descriptions>
            </div>
        );
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
        await imageStore.uploadImages(fileList, imageInfo);

        // 显示提示信息
        if (imageStore.uploadHint.status === 'success') {
            message.success(imageStore.uploadHint.message);
            navigate('/pages/visualize/ImgVisualize');
        } else if (imageStore.uploadHint.status === 'error') {
            message.error(imageStore.uploadHint.message);
        }
    }


    return (
        <RcResizeObserver
            key="resize-observer"
            onResize={(offset) => {
                setResponsive(offset.width < 596);
            }}
        >
            <ProCard
                split={responsive ? 'horizontal' : 'vertical'}
                bordered
                headerBordered
            >
                <ProCard colSpan="75%">
                    <div style={{height: '70vh', overflow: 'auto'}}>
                        {imageStore.uploadHint.isProcessing ? <div className="spin"><Spin tip="处理中...">
                            <div className='content'></div>
                        </Spin></div> : null}
                        <div style={{ height: '40vh' }}>
                        <Dragger {...props} >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">点击或者将文件夹拖拽到此处上传</p>
                        </Dragger>
                        </div>
                        {renderFileList()}
                    </div>
                </ProCard>
                <ProCard title="图片信息填写">
                    <div style={{height: '70vh'}}>
                        <Space direction="vertical" style={{width: '100%'}} size="large">
                            <Input
                                placeholder="输入本次上传记录名"
                                onChange={(e) => setImageInfo({...imageInfo, title: e.target.value})}
                            />
                            <Select
                                placeholder="选择道路"
                                style={{width: '100%'}}
                                onChange={(value) => setImageInfo({...imageInfo, road: value})}
                            >
                                {roadStore.roadData.map((road) => (
                                    <Select.Option key={road.road_id} value={road.road_id}>
                                        {road.road_name}
                                    </Select.Option>
                                ))}
                            </Select>

                            <Button type="primary"
                                    style={{
                                        width: '85%',
                                        position: 'absolute',
                                        bottom: '5vh',
                                    }}
                                    onClick={handleUpload}
                                    loading={imageStore.uploadHint.isProcessing}
                            >
                                <VerticalAlignTopOutlined/>上传
                            </Button>
                        </Space>
                    </div>
                </ProCard>
            </ProCard>
        </RcResizeObserver>
    );
});

export default UploadFolder;
