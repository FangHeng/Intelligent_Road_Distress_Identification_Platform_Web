// UploadFolder.js: 上传文件夹组件，用于上传文件夹中的图片
import React, { useState } from 'react';
import { VerticalAlignTopOutlined} from '@ant-design/icons';
import {Upload, Spin, Space, Input, Select, Button, App, Alert, Typography} from 'antd';
import {ProCard} from "@ant-design/pro-components";
import imageStore from "../../../store/ImgStore";
import roadStore from "../../../store/RoadStore";
import RcResizeObserver from "rc-resize-observer";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import { ReactComponent as CompressedPackage } from '../../../assets/icons/compressedPackage.svg';
import '../css/checkbox.css'

const { Dragger } = Upload;
const { Paragraph } = Typography;

const UploadCompressed = observer(() => {
    const [fileList, setFileList] = useState([]);
    const [responsive, setResponsive] = useState(false);
    const [imageInfo, setImageInfo] = useState({title: '', road: ''});

    const navigate = useNavigate();
    const {message} = App.useApp();

    const props = {
        name: 'file',
        multiple: true,
        // directory: true,
        accept: '.zip, .rar, .7z',
        showFileList: true,
        onChange(info) {
            setFileList(info.fileList);
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        beforeUpload: (file) => {
            return false;
        }
    };

    // // 自定义文件列表显示
    // const renderFileList = () => {
    //     return (
    //         <div style={{ marginTop: '1vh' }}>
    //             <Descriptions title="已选择文件" column={1} size="small">
    //                 <Descriptions.Item label="文件数量">{fileList.length}</Descriptions.Item>
    //                 <Descriptions.Item label="文件">
    //                     <div style={{ maxHeight: '20vh', overflow: 'auto' }}>
    //                         {fileList.map((file) => (
    //                             <Space>
    //                                 <span key={file.uid} style={{ marginRight: '2px' }}>{file.name}</span>
    //                             </Space>
    //
    //                         ))}
    //                     </div>
    //                 </Descriptions.Item>
    //             </Descriptions>
    //         </div>
    //     );
    // };


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

        // 调用 store 的 uploadCompressed 方法
        await imageStore.uploadCompressed(fileList, imageInfo);

        // 显示提示信息
        if (imageStore.uploadHint.status === 'success') {
            message.success(imageStore.uploadHint.message);
            navigate('/pages/visualize/ImgVisualize');
        } else if (imageStore.uploadHint.status === 'error') {
            message.error(imageStore.uploadHint.message);
        }
    }


    return (
        <App>
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
                        {imageStore.uploadHint.isProcessing ? <div className="result-wait-spin"><Spin tip="处理中...">
                            <div className='tip-content'></div>
                        </Spin></div> : null}
                        <div style={{ height: '40vh' }}>
                            <Dragger {...props}>
                                <p className="ant-upload-drag-icon">
                                    <CompressedPackage />
                                </p>
                                <p className="ant-upload-text">点击或者将图片压缩包拖拽到此处上传</p>
                                <p className="ant-upload-text">我们目前支持的压缩包格式有：.zip, .rar, .7z</p>
                            </Dragger>
                        </div>
                        {/*{renderFileList()}*/}
                        <div style={{
                            margin: '20px 0',
                        }}>
                            <Alert
                                message="注意"
                                description={
                                    <Paragraph>
                                        <ul>
                                            <li>请确保上传的图片压缩包中直接以图片文件为内容，不要包含文件夹。</li>
                                            <li>我们推荐大量图片上传使用压缩包的方式，以提高上传速度。</li>
                                        </ul>
                                    </Paragraph>
                                }
                                type="warning"
                                showIcon
                                closable={true}
                            />
                        </div>
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
        </App>
    );
});

export default UploadCompressed;
