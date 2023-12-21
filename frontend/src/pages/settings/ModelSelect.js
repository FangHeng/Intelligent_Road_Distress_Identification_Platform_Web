import React, {useState} from 'react';
import {
    Card,
    Radio,
    Descriptions,
    Dropdown
} from 'antd';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBolt, faWandMagicSparkles} from "@fortawesome/free-solid-svg-icons";
import userStore from "../../store/UserStore";
import {observer} from "mobx-react-lite";

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
        <Card title="首选模型设置" style={{ width: '100%' }}>
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

            <Descriptions title="模型详情">
                {preferredModel === 'Swin' && <Descriptions.Item label="Default Model">采用 Swin Transformer 对病害图像进行分类</Descriptions.Item>}
                {selectedSubModel === 'WSPLIN-IP' && <Descriptions.Item label="WSPLIN-IP">Advanced Model - WSPLIN-IP 详情</Descriptions.Item>}
                {selectedSubModel === 'WSPLIN-SS' && <Descriptions.Item label="WSPLIN-SS">Advanced Model - WSPLIN-SS 详情</Descriptions.Item>}
                {selectedSubModel === 'PicT' && <Descriptions.Item label="PicT">Advanced Model - PicT 详情</Descriptions.Item>}
            </Descriptions>
        </Card>
    );
});

export default ModelSelect;