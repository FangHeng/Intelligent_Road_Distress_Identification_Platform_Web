// ModelSelect.js: 模型选择页面，用于选择模型，包括默认模型和高级模型
import React, {useState} from 'react';
import {
    Card, Radio, Dropdown, Space, Image, Button
} from 'antd';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBolt, faFire, faWandMagicSparkles} from "@fortawesome/free-solid-svg-icons";
import userStore from "../../store/UserStore";
import {observer} from "mobx-react-lite";
import Swin from '../../assets/modelStructure/Swin.png';
import WSPLIN from '../../assets/modelStructure/WSPLIN.png';
import PicT from '../../assets/modelStructure/PicT.png';
import {PageContainer} from "@ant-design/pro-components";


// 用于根据selectedSubModel的值映射相应的显示标签
const advancedModelLabels = {
    'WSPLIN-IP': 'WSPLIN-IP',
    'WSPLIN-SS': 'WSPLIN-SS',
    'PicT': 'PicT'
};

const ModelSelect = observer(() => {

    // 初始化时，考虑高级模型的子模型, 以及是否已经选择了子模型
    const [hasSelectedSubModel, setHasSelectedSubModel] = useState(false);

    const initialModel = advancedModelLabels[userStore.userInfo.selected_model] ? 'advanced' : userStore.userInfo.selected_model;
    const [preferredModel, setPreferredModel] = useState(initialModel);
    const [selectedSubModel, setSelectedSubModel] = useState(userStore.userInfo.selected_model);


    const handleModelChange = e => {
        if (e.target.value === 'advanced' && !hasSelectedSubModel) {
            // 如果点击了高级模型但没有选择子模型
            return;
        }
        setPreferredModel(e.target.value);
        userStore.setPreferredModel(e.target.value);
        userStore.sendPreferredModel(e.target.value);
        if (e.target.value === 'Swin') {
            setSelectedSubModel('');
            setHasSelectedSubModel(false);
        }
    };

    const handleSubModelChange = ({ key }) => {
        setSelectedSubModel(key);
        userStore.setPreferredModel(key);
        userStore.sendPreferredModel(key);
        setHasSelectedSubModel(true);
        setPreferredModel('advanced');
    };

    const advancedOptions = [
        { key: 'WSPLIN-IP', label: 'WSPLIN-IP' },
        { key: 'WSPLIN-SS', label: 'WSPLIN-SS' },
        { key: 'PicT', label: 'PicT' }
    ];

    const selectedSubModelLabel = advancedModelLabels[selectedSubModel] || '高级模型';

    return (
        <PageContainer
            title="模型选择"
            content="我们提供了4种模型供您选择，您可以根据模型的优劣和您的需求选择不同的模型。"
            extra={[
                <Button type="link" onClick={() => window.location.href = 'mailto:hengfang2002@qq.com'}>
                    <FontAwesomeIcon icon={faFire} style={{color: "rgba(201,0,0,0.62)",}} size='lg'/>
                    &nbsp;
                    自定义类别和数据训练模型
                </Button>
            ]}
        >
        <Card style={{ width: '100%'}}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Radio.Group onChange={handleModelChange} value={preferredModel} size="large">
                    <Radio.Button value="Swin"  className="radio-button-min-width">
                        <FontAwesomeIcon icon={faBolt} style={{ marginRight: 8, color: '#28a745' }} />默认模型
                    </Radio.Button>
                    <Dropdown menu={{
                        items:advancedOptions,
                        selectable:true,
                        onClick:handleSubModelChange
                    }}>
                        <Radio.Button value="advanced" className="radio-button-min-width">
                            <FontAwesomeIcon icon={faWandMagicSparkles} style={{ marginRight: 8, color: '#854eea' }}/>
                            {selectedSubModelLabel}
                        </Radio.Button>
                    </Dropdown>
                </Radio.Group>
            </div>

            <div>
                {preferredModel === 'Swin' && (
                    <Card title="默认模型 - Swin 详情" style={{ width:'100%' }}>
                        <p>采用 Swin Transformer 对病害图像进行分类，适用于日常的道路检测。</p>
                        <p>模型结构如下图所示：</p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Image src={Swin} alt="Swin Image" height={500}/>
                        </div>
                    </Card>
                )}
                {selectedSubModel === 'WSPLIN-IP' && (
                    <Card title="高级模型 - WSPLIN-IP 详情" style={{ width:'100%' }}>
                        <p>高级模型 - WSPLIN-IP 用于更好性能地检测道路。</p>
                        <p>模型结构如下图所示：</p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Image src={WSPLIN} alt="WSPLIN_IP Image" height={500}/>
                        </div>
                    </Card>
                )}
                {selectedSubModel === 'WSPLIN-SS' && (
                    <Card title="高级模型 - WSPLIN-SS 详情" style={{ width:'100%' }}>
                        <p>高级模型 - WSPLIN-SS 用于更好性能地检测道路。</p>
                        <p>模型结构如下图所示：</p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Image src={WSPLIN} alt="WSPLIN_SS Image" height={500}/>
                        </div>
                    </Card>
                )}
                {selectedSubModel === 'PicT' && (
                    <Card title="高级模型 - PicT 详情" style={{ width:'100%' }}>
                        <p>高级模型 - PicT 我们推荐使用的高级模型，适用于复杂的道路病害检测。</p>
                        <p>模型结构如下图所示：</p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Image src={PicT} alt="PicT Image" height={500}/>
                        </div>
                    </Card>
                )}
            </div>
            </Space>
        </Card>
        </PageContainer>
    );
});

export default ModelSelect;