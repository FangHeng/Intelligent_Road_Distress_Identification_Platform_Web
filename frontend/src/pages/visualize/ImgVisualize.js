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
    Drawer, Pagination, Tag, Slider, InputNumber
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
import './CSS/Visualize.css';
import '../detect/css/checkbox.css';
import imgStore from "../../store/ImgStore";
import {observer} from "mobx-react-lite";


const { Option } = Select;
const options = [
    '胶结裂隙', '裂纹', '纵向裂纹', '松散',
    '大裂缝', '修补', '正常', '横向裂纹'
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

    //抽屉
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState('right');

    // 调参阈值
    const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);
    const [filterOption, setFilterOption] = useState('all');


    // 当组件加载时，只调用一次 fetchLastUploadId
    useEffect(() => {
        imgStore.fetchLastUploadId();
    }, []); // 空依赖数组表示只在组件挂载时执行

    useEffect(() => {
        if (imgStore.isLastUploadIdFetched) {
            imgStore.fetchResultData();
            imgStore.isLastUploadIdFetched = false; // 重置标志
        }
    }, [imgStore.isLastUploadIdFetched]); // 依赖于 isLastUploadIdFetched


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
                            uploadName:upload.upload_name,
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

    const showDrawer = () => {
        setOpen(true);
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

        let filteredPhotos = photos;
        // 根据 filterOption 过滤
        if (filterOption === 'disease') {
            filteredPhotos = filteredPhotos.filter(photo => photo.classificationResult !== 6);
        } else if (filterOption === 'normal') {
            filteredPhotos = filteredPhotos.filter(photo => photo.classificationResult === 6);
        }

        // 根据 checkedList 进一步过滤
        if (checkedList.length > 0 && !checkAll) {
            filteredPhotos = filteredPhotos.filter(photo => checkedList.includes(classification_mapping[photo.classificationResult]));
        }

        return filteredPhotos.slice(indexOfFirstPhoto, indexOfLastPhoto);
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

    const handleSelectChange = value => {
        setFilterOption(value);

        // 当选择 "所有预测图象" 时，全选所有 Checkbox 选项
        if (value === 'all') {
            setCheckedList(options.map(option => option)); // 设置为所有选项
            setCheckAll(true); // 更新全选状态为 true
            setIndeterminate(false); // 设置不确定状态为 false
        } else {
            // 对于其他选择，可以选择保持当前的 checkedList 或进行其他操作
            // 例如，如果需要重置，可以使用 setCheckedList([])
            // 如果需要保持当前状态，则不做操作
        }

        setCurrentPage(1); // 返回到第一页
    };


    const getCheckboxOptions = () => {
        switch(filterOption) {
            case 'all':
                return options; // 显示所有选项
            case 'disease':
                return options.filter(option => option !== classification_mapping[6]); // 排除 '正常'
            case 'normal':
                return [classification_mapping[6]]; // 只显示 '正常'
            default:
                return options; // 默认显示所有选项
        }
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


    const onChange = (value) => {
        if (isNaN(value)) {
            return;
        }
        setConfidenceThreshold(value);
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

    // 更新 renderTags 函数，使其根据 viewMode 来调整 Space 组件的方向
    const renderTags = (photo) => {
        const isGreen = photo.classificationResult === 6 || photo.confidence < confidenceThreshold;
        const spaceDirection = viewMode === 'grid' ? 'vertical' : 'horizontal';

        return (
            <Space style={{ flexWrap: 'wrap' }} direction={spaceDirection}>
                <Tag color={isGreen ? 'green' : 'red'}>
                    {classification_mapping[photo.classificationResult]}（置信度: {photo.confidence.toFixed(2)}）
                </Tag>
                <Tag>所在道路：{photo.roadName}</Tag>
                <Tag>上传名：{photo.uploadName}</Tag>
            </Space>
        );
    };


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
                            renderTags(item)
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
                    style={{ width: 240, margin: '1vw' }}
                    cover={<img alt={photo.name} src={photo.imgUrl} />}
                    onClick={() => handleCardClick(photo)}
                >
                    <Card.Meta title={photo.imageName} description={
                        renderTags(photo)
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
            showTotal={total => `总共 ${total} 张`}
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
                    <div className="threshold-label">阈值:
                        <Row>
                            <Col span={16}>
                                <Slider
                                    min={0}
                                    max={1}
                                    onChange={onChange}
                                    value={typeof confidenceThreshold === 'number' ? confidenceThreshold : 0}
                                    step={0.01}
                                />
                            </Col>
                            <Col span={4}>
                                <InputNumber
                                    min={0}
                                    max={1}
                                    style={{
                                        margin: '0 16px',
                                    }}
                                    step={0.01}
                                    value={confidenceThreshold}
                                    onChange={onChange}
                                />
                            </Col>
                        </Row>
                    </div>
                    <Divider></Divider>
                    <Space direction="vertical" style={{ width: '100%' }}>
                    <div className="threshold-label">预测展示：</div>
                    <Select defaultValue={filterOption} style={{ width: '100%',  marginBottom:'20px' }} onChange={handleSelectChange}>
                        <Option value="all">所有预测图象</Option>
                        <Option value="disease">只有病害的图像</Option>
                        <Option value="normal">只有正常的图像</Option>
                    </Select>

                    <Space direction="vertical" style={{ width: '100%',}}>
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
                    </Space>
                    <div style={{ marginBottom: '10px' }}></div>
                    <Checkbox.Group value={checkedList} onChange={onCheckboxChange} style={{ width: '100%' }} className="large-font-checkbox">
                        {getCheckboxOptions().map((value, index) => (
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
