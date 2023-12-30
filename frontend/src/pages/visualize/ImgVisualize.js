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
    Modal,
    List,
    Segmented,
    Button,
    Drawer, Pagination, Tag, Slider, InputNumber, Spin, message, Input, Avatar, Menu, Descriptions
} from 'antd';
import DecimalStep from "../../components/Slider/DecimalStep";
import '../detect/css/checkbox.css';
import {
    AppstoreOutlined,
    BarsOutlined,
    PictureOutlined,
    VerticalAlignBottomOutlined
} from "@ant-design/icons";
import './CSS/Visualize.css';
import '../detect/css/checkbox.css';
import imgStore from "../../store/ImgStore";
import {observer} from "mobx-react-lite";
import historyStore from "../../store/HistoryStore";
import axiosInstance from "../../utils/AxiosInstance";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import chatStore from "../../store/ChatStore";
import userStore from "../../store/UserStore";
import logoMini from "../../assets/img/logo-mini.png";


const {Option} = Select;
const {CheckableTag} = Tag;
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

    const [isLoading, setIsLoading] = useState(false);

    // 下载报告的id
    const [reportIds, setReportIds] = useState([]);

    useEffect(() => {
        if (imgStore.selectedUploadId.length === 0) {
            const fetchData = async () => {
                setIsLoading(true);
                if (!historyStore.cameFromDetect) {
                    try {
                        const lastUploadId = await imgStore.fetchLastUploadId();
                        if (lastUploadId) {
                            await imgStore.fetchResultData([lastUploadId]);
                            setReportIds([lastUploadId])
                        }
                    } catch (error) {
                        console.error("Error during data fetching:", error);
                    }
                }
                setIsLoading(false);
            };

            fetchData();
        }
    }, []);

    useEffect(() => {
        if (historyStore.cameFromDetect) {
            setIsLoading(true);
            if (imgStore.selectedUploadId.length > 0) {
                imgStore.fetchResultData(imgStore.selectedUploadId)
                    .then(() => {
                        setReportIds(imgStore.selectedUploadId);
                    })
                    .finally(() => setIsLoading(false));
            }
            historyStore.setCameFromDetect(false);
        }
    }, [historyStore.cameFromDetect]);

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
                            uploadName: upload.upload_name,
                            model: upload.selected_model,
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
        handleModalCancel();
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
        switch (filterOption) {
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
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span>检测结果</span>
            <Segmented
                options={[
                    {
                        value: 'Kanban',
                        icon: <AppstoreOutlined/>,
                    },
                    {
                        value: 'List',
                        icon: <BarsOutlined/>,
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
            <Space style={{flexWrap: 'wrap'}} direction={spaceDirection}>
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
                            avatar={item.imgUrl ? <img src={item.imgUrl} alt={item.title} style={{width: '5vw'}}/> :
                                <PictureOutlined/>}
                            title={item.imageName}
                            description={
                                renderTags(item)
                            }
                        />
                    </List.Item>
                )}
            />
            <div style={{marginBottom: '1.5vh'}}></div>
        </>
    );

    const gridView = (
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {getCurrentPhotos().map(photo => (
                <Card
                    key={photo.id}
                    hoverable
                    style={{width: 240, margin: '1vw'}}
                    cover={<img alt={photo.name} src={photo.imgUrl}/>}
                    onClick={() => handleCardClick(photo)}
                >
                    <Card.Meta title={photo.imageName} description={
                        renderTags(photo)
                    }/>
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

    const handleExport = () => {
        // 确保 reportIds 是一个数组且不为空
        if (!Array.isArray(reportIds) || reportIds.length === 0) {
            message.error("没有报告ID可供下载!");
            return;
        }

        // 将 reportIds 转换为查询字符串参数
        const params = new URLSearchParams();
        reportIds.forEach(id => params.append('upload_id', id));

        // 使用 axios 发送 GET 请求
        axiosInstance.get('/irdip/export_to_excel/', {
            params: params,
            responseType: 'blob', // 重要：设置响应类型为 blob
        })
            .then(response => {
                // 创建一个链接元素，用于下载文件
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'exported_data.xlsx');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => {
                console.error('下载时出错:', error);
                message.error('下载时出错!');
            });
    };

    // 聊天
    const [userInput, setUserInput] = useState('');

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSendClick = () => {
        if (userInput.trim()) {
            // 添加用户消息到本地存储
            chatStore.addMessage('user', userInput);

            // 发送消息（包括整个历史）给 GPT
            chatStore.sendMessage(chatStore.messages);

            // 清空输入框
            setUserInput('');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && event.shiftKey === false) {
            event.preventDefault(); // 阻止默认的换行行为
            handleSendClick(); // 调用发送消息的函数
        }
    };

    // 打开模态框
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeMenu, setActiveMenu] = useState('1');

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const menuItems = [
        {label: '导出具体检测结果', key: '1'},
        {label: '进行对话', key: '2'},
        {label: '导出整体报告', key: '3'}
    ];

    const handleMenuClick = e => {
        setActiveMenu(e.key);
    };

    // 选tag
    const tagDescriptions = {
        '总体评价': '综合分析一条城市主干道的总体状况。考虑道路的年龄、主要材料（如沥青或混凝土）、流量（包括轻型和重型车辆）、以及近期的维修记录。评估道路的整体结构完整性、耐用性和当前性能，包括对其承受日常交通压力的能力的评价。',
        '路面状况': '详细描述该道路的路面状况。检查和记录路面的裂缝、坑洞、凹陷、路面不平、水损伤或其他明显病害。分析这些病害的可能原因，如过度使用、材料老化或不良的初始施工。考虑道路表面的摩擦和平整度，以及它们对驾驶舒适度和车辆磨损的影响。',
        '环境因素': "探讨环境因素如何影响道路状况。包括气候（如极端温度、降雨、雪和冰）、地理位置（如海拔、倾斜度）以及周围植被的影响。评估这些因素如何促进道路的退化，比如通过温度变化引起的材料膨胀/收缩，或者植被根系对道路结构的潜在损害。",
        '安全性评估': "进行道路的安全性评估。分析路面状况、可见性（如路面标记的清晰度）、交通标志的完整性和可读性、以及道路照明的充足性如何影响整体交通安全。考虑特殊情况下的安全性，如雨季或雪天的滑移风险。基于当前的道路状况，评估对车辆和行人的潜在危险。",
        '维修建议': "提出针对发现的道路病害的维修建议。包括紧急修复措施（如填补坑洞）、短期和长期维护计划。建议可能包括重新铺设部分或全部路面、改善排水系统、更新路面标记和交通标志等。考虑成本效益分析，提出最具成本效率的解决方案，以优化预算并最大限度地延长道路的使用寿命。"
    };

    const [selectedTags, setSelectedTags] = useState(['总体评价']);
    const [selectedTagInfo, setSelectedTagInfo] = useState(tagDescriptions['总体评价']);


    const updateTagInfo = (tag) => {
        setSelectedTagInfo(tagDescriptions[tag]);
    };

    const handleChange = (tag, checked) => {
        const nextSelectedTags = checked
            ? [...selectedTags, tag]
            : selectedTags.filter((t) => t !== tag);
        setSelectedTags(nextSelectedTags);

        // 如果当前标签被选中，则更新详细信息，否则清空
        if (checked) {
            updateTagInfo(tag);
        } else {
            // 如果取消选中的标签是当前显示的详细信息，则清空详细信息
            if (selectedTagInfo === tagDescriptions[tag]) {
                setSelectedTagInfo('');
            }
        }
    };
    // 生成报告
    const [isReportDrawerVisible, setIsReportDrawerVisible] = useState(false);

    const showReportDrawer = () => {
        setIsReportDrawerVisible(true);
    };

    const closeReportDrawer = () => {
        setIsReportDrawerVisible(false);
    };

    const [isReportLoading, setIsReportLoading] = useState(false);
    const generateReport = () => {
        setIsReportLoading(true);
        // 构建查询参数
        const queryParams = new URLSearchParams();
        reportIds.forEach(id => queryParams.append('upload_id', id));

        // 发起 GET 请求
        axiosInstance.get('/irdip/generate_report/', {
            params: queryParams
        })
            .then(response => {
                // 处理响应数据
                const report = response.data;
                console.log(report)
                message.success('报告生成成功!');
                setIsReportLoading(false);
                showReportDrawer();
                // 关闭模态框
                handleModalCancel();
                imgStore.setReportData(report);
                console.log(imgStore.reportData);
            })
            .catch(error => {
                // 错误处理
                message.error('报告生成失败!');
                setIsReportLoading(false);
                console.error('Error generating report:', error);
                // 这里可以添加错误处理逻辑
            });
    };


    const renderContent = () => {
        switch (activeMenu) {
            case '1':
                return (
                    <>
                        <div>
                            <strong>
                                导出检测结果：
                            </strong>
                            <p style={{marginTop: '2vh'}}>
                                通过”纹影探路”平台，您可以上传道路的照片进行智能分析。此功能允许您导出每一条路的每一张照片的详细分析结果。点击下方按钮，即可下载包含所有检测数据和分析的报告（excel文件），助您全面了解道路状况。
                            </p>
                        </div>
                        <Space style={{width: '100%', flexDirection: 'column'}}>
                            <Button onClick={handleExport} type='primary' style={{marginTop: '3vh'}}>
                                下载检测结果
                            </Button>
                        </Space>
                    </>
                );
            case '2':
                return (
                    <>
                        <div>
                            <strong>
                                交互式对话查询：
                            </strong>
                            <p style={{marginTop: '2vh'}}>
                                利用大型语言模型的能力，我们的系统不仅能分析道路照片，还能提供交互式的查询服务。在这里，您可以直接与我们的智能系统对话，查询道路检测的具体结果和分析细节。点击下方按钮打开对话界面，开始您的交互式查询体验。
                            </p>
                        </div>
                        <Space style={{width: '100%', flexDirection: 'column'}}>
                            <Button type="primary" onClick={showDrawer} style={{marginTop: '3vh'}}>
                                打开对话界面
                            </Button>
                        </Space>
                    </>
                );
            case '3':
                const tags = ['总体评价', '路面状况', '环境因素', '安全性评估', '维修建议'];

                return (
                    <div>
                        <div style={{marginBottom: '2vh'}}>
                            <strong>通过选择以下几个道路方面，我们将为你提供一个总体的报告：</strong>
                        </div>
                        <>
                            <strong style={{marginRight: 8}}>
                                方面:
                            </strong>
                            <Space size={[0, 8]} wrap>
                                {tags.map((tag) => (
                                    <CheckableTag
                                        key={tag}
                                        checked={selectedTags.includes(tag)}
                                        onChange={(checked) => handleChange(tag, checked)}
                                    >
                                        {tag}
                                    </CheckableTag>
                                ))}
                            </Space>
                        </>
                        <Space style={{width: '100%', flexDirection: 'column', marginTop: '1vh'}}>
                            <Button type="primary" onClick={generateReport} style={{marginTop: '20px'}}
                                    loading={isReportLoading}>
                                生成报告
                            </Button>
                        </Space>
                        {selectedTagInfo && (
                            <div style={{marginTop: '20px'}}>
                                <p>{selectedTagInfo}</p>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Row gutter={24}>
            <Col span={18}>
                <Card title={cardTitle} style={{height: '95vh', overflow: 'auto'}}>
                    <Spin spinning={isLoading} className='spin'>
                    </Spin>
                    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                        <div style={{flex: 1}}> {/* Content area */}
                            {viewMode === 'grid' ? gridView : listView}
                        </div>
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}> {/* Pagination area */}
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
                        <Image alt="example" style={{width: '100%'}} src={previewImage}/>
                    </Col>
                    <Col span={12}>
                        <h3>{selectedImage ? selectedImage.name : '图片名称'}</h3>
                        <Divider/> {/* 这是一个简单的分割线 */}
                        <div>
                            <h4>阈值</h4>
                            <DecimalStep/>
                            <h4>原始图像大小：</h4>
                            <h4>分块大小：</h4>
                            <h4>步长：</h4>
                            <h4>每个图像的分块数量：</h4>
                        </div>
                    </Col>
                </Row>
            </Modal>

            <Col span={6}>
                <Card title="调参面板" style={{height: '95vh'}}>
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
                    <Space direction="vertical" style={{width: '100%'}}>
                        <div className="threshold-label">预测展示：</div>
                        <Select defaultValue={filterOption} style={{width: '100%', marginBottom: '20px'}}
                                onChange={handleSelectChange}>
                            <Option value="all">所有预测图象</Option>
                            <Option value="disease">只有病害的图像</Option>
                            <Option value="normal">只有正常的图像</Option>
                        </Select>

                        <Space direction="vertical" style={{width: '100%',}}>
                            <div style={{marginBottom: '10px'}} className="threshold-label">图片类型：</div>
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
                    <div style={{marginBottom: '10px'}}></div>
                    <Checkbox.Group value={checkedList} onChange={onCheckboxChange} style={{width: '100%'}}
                                    className="large-font-checkbox">
                        {getCheckboxOptions().map((value, index) => (
                            <Space key={index} direction="vertical" style={{width: '100%'}}>
                                <Checkbox value={value}>
                                    {value}
                                </Checkbox>
                            </Space>
                        ))}
                    </Checkbox.Group>
                    <div style={{position: 'absolute', bottom: '5vh', width: '100%'}}>
                        <Space style={{width: '100%', justifyContent: 'center',}} size='large'>
                            {/*<Button type="primary" onClick={handleExport}><VerticalAlignBottomOutlined />*/}
                            {/*    导出结果*/}
                            {/*</Button>*/}
                            {/*<Button type="primary" onClick={showDrawer}>*/}
                            {/*    <PlusOutlined />*/}
                            {/*    对话*/}
                            {/*</Button>*/}
                            <Button type="primary" block onClick={showModal}><VerticalAlignBottomOutlined/>
                                导出结果
                            </Button>
                        </Space>
                        <Modal
                            title="导出结果"
                            open={isModalVisible}
                            onOk={handleOk}
                            onCancel={handleModalCancel}
                            width={800}
                            footer={null}
                            style={{top: '25%'}} // 控制 Modal 在垂直方向上的位置
                        >
                            {/*<div style={{ height: '50vh' }}>*/}
                            <Row>
                                <Col span={8}>
                                    <Menu
                                        onClick={handleMenuClick}
                                        style={{width: 200}}
                                        defaultSelectedKeys={['1']}
                                        mode="inline"
                                        items={menuItems}
                                    />
                                </Col>
                                <Col span={16} style={{height: '30vh'}}>
                                    {renderContent()}
                                </Col>
                            </Row>
                            {/*</div>*/}
                        </Modal>
                    </div>
                    <Drawer
                        title="进行对话"
                        placement={placement}
                        onClose={onClose}
                        open={open}
                        // size={'large'}
                        width={'50%'}
                    >
                        {/*根据isSending来判断是否加载spin*/}
                        {chatStore.isSending && (
                            <div className="spin">
                                <Spin/>
                            </div>
                        )}
                        <div className="chat-container">
                            {/* 聊天历史 */}
                            <div className="chat-history">
                                {chatStore.messages
                                    .filter(message => message.role !== 'analysis') // 过滤掉 role 为 'analysis' 的消息
                                    .map((message, index) => (
                                        <div
                                            key={index}
                                            className={`chat-message ${message.role === 'user' ? 'user-message' : 'gpt-message'}`}
                                        >
                                            {message.role === 'user' && (
                                                <div className="message-avatar">
                                                    {/* 用户头像 */}
                                                    <Avatar src={userStore.userInfo.avatar}/>
                                                </div>
                                            )}
                                            <div className="message-content">
                                                {message.content}
                                            </div>
                                            {message.role === 'gpt' && (
                                                <div className="message-avatar">
                                                    {/* GPT头像 */}
                                                    <Avatar src={logoMini} size={48}/> {/* GPT 头像的 URL */}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>

                            {/* 输入区 */}
                            <div className="message-input">
                                <Input.TextArea
                                    rows={1}
                                    placeholder="输入你的问题"
                                    value={userInput}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyPress}
                                />
                                <Button
                                    type="primary"
                                    onClick={handleSendClick}
                                    disabled={chatStore.isSending}
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} style={{marginRight: '5px'}}/>
                                    发送
                                </Button>
                            </div>
                        </div>
                    </Drawer>
                    <Drawer
                        title="报告详情"
                        placement="right"
                        onClose={closeReportDrawer}
                        open={isReportDrawerVisible}
                        width={'50%'}
                    >
                        <Descriptions bordered column={3}>
                            {imgStore.reportData.map((item, index) => {
                                if (item.upload_time) {
                                    // 对于包含多个小字段的项，分组以适应三列布局
                                    return (
                                        <React.Fragment key={index}>
                                            <Descriptions.Item label="上传者">{item.uploader}</Descriptions.Item>
                                            <Descriptions.Item label="上传时间">{item.upload_time}</Descriptions.Item>
                                            <Descriptions.Item label="路名">{item.road_name}</Descriptions.Item>
                                            <Descriptions.Item label="上传数量">{item.upload_count}</Descriptions.Item>
                                            <Descriptions.Item label="损坏比例">{item.damage_ratio}</Descriptions.Item>
                                            <Descriptions.Item
                                                label="选用模型">{item.selected_model}</Descriptions.Item>
                                            <Descriptions.Item label="所在区域" span={2}>
                                                {`${item.province} ${item.city} ${item.district}`}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="经纬度信息" span={1}>
                                                {`${item.gps_longitude} ${item.gps_latitude}`}
                                            </Descriptions.Item>
                                        </React.Fragment>
                                    );
                                } else {
                                    // 仅当item.theme出现在selectedTags中时，才渲染该项
                                    if (selectedTags.includes(item.theme)) {
                                        return (
                                            <Descriptions.Item label={item.theme} key={item.theme} span={3}>
                                                {item.answer}
                                            </Descriptions.Item>
                                        );
                                    }
                                }
                            })}
                        </Descriptions>
                    </Drawer>
                </Card>
            </Col>
        </Row>
    );
});

export default ImgVisualize;
