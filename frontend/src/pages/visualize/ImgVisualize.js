import React, {useEffect, useState} from 'react';
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
    Drawer, Pagination, Tag
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
import image0 from '../../assets/img/cementation_fissures_0.jpg';
import image1 from '../../assets/img/cementation_fissures_1.jpg';
import './CSS/Visualize.css';
import '../detect/css/checkbox.css';
import imgStore from "../../store/ImgStore";
import {observer} from "mobx-react-lite";
import {reaction} from "mobx";


const { Option } = Select;
const options = [
    '正常', '横向裂缝', '巨大裂缝', '鳄鱼裂缝',
    '浇注裂缝', '纵向裂缝', '修补', '开槽'
];

const classification_mapping = {
    0: "胶结裂隙",
    1: "裂纹",
    2: "纵向裂纹",
    3: "松散",
    4: "大裂缝",
    5: "修补",
    6: "正常",
    7: "横向裂纹"
};

const ImgVisualize = observer(() => {
    const [viewMode, setViewMode] = useState('grid');
    const [previewVisible, setPreviewVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    // 分页
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSizeGrid, setPageSizeGrid] = useState(8);
    const [pageSizeList, setPageSizeList] = useState(9);
    // 选择图片类型：
    const [checkedList, setCheckedList] = useState([]);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
    const [photos, setPhotos] = useState([]);

    // // 当组件加载时，只调用一次 fetchLastUploadId
    // useEffect(() => {
    //     imgStore.fetchLastUploadId();
    // }, []); // 空依赖数组表示只在组件挂载时执行
    //
    // useEffect(() => {
    //     if (imgStore.isLastUploadIdFetched) {
    //         imgStore.fetchResultData();
    //         imgStore.isLastUploadIdFetched = false; // 重置标志
    //     }
    // }, [imgStore.isLastUploadIdFetched]); // 依赖于 isLastUploadIdFetched


    useEffect(() => {
        if (imgStore.resultData) {
            const newPhotos = [];

            Object.values(imgStore.resultData).forEach(upload => {
                if (upload !== "Upload record not found") {
                    upload.files.forEach(file => {
                        newPhotos.push({
                            id: file.file_id,
                            uploader: upload.uploader,
                            roadName: upload.road_name,
                            imageName: file.file_name,
                            classificationResult: file.classification_result,
                            confidence: file.confidence,
                            imgUrl: `data:image/jpeg;base64,${file.img}`
                        });
                    });
                }
            });

            setPhotos(newPhotos);
        }
    }, [imgStore.resultData]);

    const handleCardClick = (image) => {
        setSelectedImage(image);
        setPreviewImage(image.imgUrl);
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

    const getCurrentPageSize = () => {
        return viewMode === 'grid' ? pageSizeGrid : pageSizeList;
    };

    const getCurrentPhotos = () => {
        const pageSize = getCurrentPageSize();
        const indexOfLastPhoto = currentPage * pageSize;
        const indexOfFirstPhoto = indexOfLastPhoto - pageSize;
        return photos.slice(indexOfFirstPhoto, indexOfLastPhoto);
    };

    const handlePageChange = page => {
        setCurrentPage(page);
    };

    const handleSizeChange = (current, size) => {
        if (viewMode === 'grid') {
            setPageSizeGrid(size);
        } else {
            setPageSizeList(size);
        }
        setCurrentPage(1); // 通常在改变页大小时回到第一页
    };

    const onCheckAllChange = e => {
        setCheckedList(e.target.checked ? options : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };

    const onCheckboxChange = list => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < options.length);
        setCheckAll(list.length === options.length);
    };

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
        <>
            <List
                size="large"
                bordered
                dataSource={getCurrentPhotos()}
                renderItem={item => (
                    <List.Item key={item.id} onClick={() => handleCardClick(item)} className="clickable-item">
                        <List.Item.Meta
                            avatar={item.imgUrl ? <img src={item.imgUrl} alt={item.title} style={{ width: '5vh' }} /> : <PictureOutlined />}
                            title={item.imageName}
                            description={
                            <>
                                <Tag color="geekblue">{item.roadName}</Tag>
                                <Tag color="orange">{classification_mapping[item.classificationResult]}（置信度: {item.confidence.toFixed(2)}）</Tag>
                            </>
                        }
                        />
                    </List.Item>
                )}
            />
            <div style={{marginBottom:'1.5vh'}}></div>
        </>
    );

    const gridView = (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {getCurrentPhotos().map(photo => (
                <Card
                    key={photo.id}
                    hoverable
                    style={{ width: 240, margin: '10px' }}
                    cover={<img alt={photo.name} src={photo.imgUrl} />}  // 确保这里使用 photo.src
                    onClick={() => handleCardClick(photo)}
                >
                    <Card.Meta title={photo.imageName} description={
                        <Space style={{ flexWrap: 'wrap' }} direction="vertical">
                            <Tag color="geekblue">{photo.roadName}</Tag>
                            <Tag color="orange">{classification_mapping[photo.classificationResult]}（置信度: {photo.confidence.toFixed(2)}）</Tag>
                        </Space>
                    } />
                </Card>
            ))}
        </div>
    );


    const pagination = (
        <Pagination
            current={currentPage}
            onChange={handlePageChange}
            onShowSizeChange={handleSizeChange}
            total={photos.length}
            pageSize={getCurrentPageSize()}
            showQuickJumper
            showSizeChanger={true}
            showTotal={total => `共 ${total} 张`}
            pageSizeOptions={['8', '9', '20', '50']}
        />
    );

    return (
        <Row gutter={24}>
            <Col span={18}>
                <Card title={cardTitle} style={{ height: '95vh', overflow: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ flex: 1 }}> {/* Content area */}
                            {viewMode === 'grid' ? gridView : listView}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}> {/* Pagination area */}
                            {pagination}
                        </div>
                    </div>
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
                    <div style={{ marginTop: '5px'}} className="threshold-label">预测展示：</div>
                    <Select defaultValue="all" style={{ width: '100%', marginTop: '20px' }}>
                        <Option value="all">所有预测图象</Option>
                        <Option value="disease">只有病害的图像</Option>
                        <Option value="normal">只有正常的图像</Option>
                    </Select>
                    <Divider></Divider>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <div style={{ marginBottom: '10px' }} className="threshold-label">图片类型：</div>
                        <Checkbox
                            indeterminate={indeterminate}
                            onChange={onCheckAllChange}
                            checked={checkAll}
                            className="large-font-checkbox-item"
                        >
                            所有类型
                        </Checkbox>
                    </Space>
                    <div style={{ marginBottom: '10px' }}></div>
                    <Checkbox.Group value={checkedList} onChange={onCheckboxChange} style={{ width: '100%' }} className="large-font-checkbox">
                        {options.map((value, index) => (
                            <Space key={index} direction="vertical" style={{ width: '100%' }}>
                                <Checkbox value={value}>
                                    {value}
                                </Checkbox>
                            </Space>
                        ))}
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
});

export default ImgVisualize;
