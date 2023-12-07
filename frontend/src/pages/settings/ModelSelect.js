import React, {useState} from 'react';
import {
    Card,
    Radio,
    Descriptions,
    Dropdown
} from 'antd';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBolt, faWandMagicSparkles} from "@fortawesome/free-solid-svg-icons";

const ModelSelect = () => {
    const [preferredModel, setPreferredModel] = useState('default');
    const [selectedSubModel, setSelectedSubModel] = useState('');
    const [loading, setLoading] = useState(false);

    // 用于根据selectedSubModel的值映射相应的显示标签
    const advancedModelLabels = {
        'WSPLIN-IP': 'WSPLIN-IP',
        'WSPLIN-SS': 'WSPLIN-SS',
        'PicT': 'PicT'
    };

    const handleModelChange = e => {
        setPreferredModel(e.target.value);
        // 如果选择默认模型，重置子模型选择
        if (e.target.value === 'default') {
            setSelectedSubModel(null);
        }
    };

    const handleSubModelChange = ({ key }) => {
        setSelectedSubModel(key);
        // 当选择子模型时，自动切换到高级模型
        setPreferredModel('advanced');
    };

    const advancedOptions = [
        { key: 'wsplin_ip', label: 'wsplin_ip' },
        { key: 'wsplin_sp', label: 'wsplin_sp' },
        { key: 'PicT', label: 'PicT' }
    ];

    const selectedSubModelLabel = advancedModelLabels[selectedSubModel] || '高级模型';

    return (
        <Card title="首选模型设置" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Radio.Group onChange={handleModelChange} value={preferredModel} size="large">
                    <Radio.Button value="default">
                        <FontAwesomeIcon icon={faBolt} style={{ marginRight: 8, color: '#28a745' }} />默认模型
                    </Radio.Button>
                    <Dropdown menu={{
                        items:advancedOptions,
                        selectable:true,
                        defaultSelectedKeys:['wsplin_ip'],
                        onClick:handleSubModelChange
                    }}>
                        <Radio.Button value="advanced">
                            <FontAwesomeIcon icon={faWandMagicSparkles} style={{ marginRight: 8, color: '#854eea' }}/>
                            {selectedSubModelLabel}
                        </Radio.Button>
                    </Dropdown>
                </Radio.Group>
            </div>

            <Descriptions title="模型详情">
                {preferredModel === 'default' && <Descriptions.Item label="Default Model">采用 Swin Transformer 对病害图像进行分类</Descriptions.Item>}
                {selectedSubModel === 'wsplin_ip' && <Descriptions.Item label="wsplin_ip">Advanced Model - wsplin_ip 详情</Descriptions.Item>}
                {selectedSubModel === 'wsplin_sp' && <Descriptions.Item label="wsplin_sp">Advanced Model - wsplin_sp 详情</Descriptions.Item>}
                {selectedSubModel === 'PicT' && <Descriptions.Item label="PicT">Advanced Model - PicT 详情</Descriptions.Item>}
            </Descriptions>
        </Card>
    );
}

export default ModelSelect;