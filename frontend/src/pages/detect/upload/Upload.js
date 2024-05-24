// Upload.js: 上传图片的页面，包括图片上传和图片信息填写
import React, {useState} from 'react';
import {Upload, Button, Input, Select, Space, Modal, Spin, App} from 'antd';
import {PlusOutlined, VerticalAlignTopOutlined} from '@ant-design/icons';
import {observer} from 'mobx-react-lite'
import imageStore from '../../../store/ImgStore'
import roadStore from '../../../store/RoadStore'
import '../css/ImageList.css'
// import {getBase64} from "../../../utils/utils";
import {useNavigate} from "react-router-dom";
import {ProCard} from "@ant-design/pro-components";
import RcResizeObserver from 'rc-resize-observer';
import historyStore from "../../../store/HistoryStore";

const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};


const ImageUpload = observer(() => {
    const [fileList, setFileList] = useState([]);
    const [imageInfo, setImageInfo] = useState({title: '', road: ''});
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const navigate = useNavigate();
    const {message} = App.useApp();

    const handleFileChange = ({fileList}) => setFileList(fileList);

    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    // const handlePreview = async (file) => {
    //     if (!file.url && !file.preview) {
    //         // 创建一个Blob URL
    //         file.preview = URL.createObjectURL(file.originFileObj);
    //     }
    //     setPreviewImage(file.url || file.preview);
    //     setPreviewOpen(true);
    //     setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    // };
    //
    // // 在组件卸载时释放Blob URL
    // useEffect(() => {
    //     // 组件卸载时的清理函数
    //     return () => {
    //         // 如果有预览图，释放Blob URL
    //         if (fileList && fileList.length > 0) {
    //             fileList.forEach(file => {
    //                 if (file.preview) {
    //                     URL.revokeObjectURL(file.preview);
    //                 }
    //             });
    //         }
    //     };
    // }, [fileList]); // 依赖项是fileList，确保每次fileList变化时都能正确清理


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

        // // 跳转到检测记录
        // navigate('/pages/detect/Detect');

        // 调用 store 的 uploadImages 方法
        await imageStore.uploadImages(fileList, imageInfo);

        if (imageStore.uploadHint.status === 'success') {
            message.success(imageStore.uploadHint.message);
            // navigate('/pages/visualize/ImgVisualize');
            navigate('/pages/detect/Detect')
            historyStore.setCameFromUpload(true);
        } else if (imageStore.uploadHint.status === 'error') {
            message.error(imageStore.uploadHint.message);
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined/>
            <div style={{marginTop: 8}}>上传</div>
        </div>
    );

    const [responsive, setResponsive] = useState(false);

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
                        <div style={{height: '80vh', overflow: 'auto', minHeight: '700px'}}>
                            {/*{imageStore.uploadHint.isProcessing ? <div className='result-wait-spin'><Spin tip="处理中...">*/}
                            {/*    <div className='tip-content'></div>*/}
                            {/*</Spin></div> : null}*/}
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
                                    alt="选择的图片"
                                    style={{
                                        width: '100%',
                                    }}
                                    src={previewImage}
                                />
                            </Modal>
                        </div>
                    </ProCard>
                    <ProCard title="图片信息填写">
                        <div style={{height: '80vh', minHeight: '700px'}}>
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
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent:'center'}}>
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
                                </div>
                            </Space>
                        </div>
                    </ProCard>
                </ProCard>
            </RcResizeObserver>
        </App>
    );
});

export default ImageUpload;