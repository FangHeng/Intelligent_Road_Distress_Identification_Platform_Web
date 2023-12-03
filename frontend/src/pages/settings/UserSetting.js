import React, {useState} from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Radio,
    Descriptions,
    Space,
    Row,
    Col,
    Upload,
    Tag,
    Avatar,
    Divider, Dropdown
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import {EditOutlined, } from "@ant-design/icons";
import MaleAvatar from '../../assets/Male.png'

const UserSetting = () => {
    const [preferredModel, setPreferredModel] = useState('default');
    const [selectedSubModel, setSelectedSubModel] = useState('');
    const [loading, setLoading] = useState(false);

    // 用于根据selectedSubModel的值映射相应的显示标签
    const advancedModelLabels = {
        'wsplin_ip': 'wsplin_ip',
        'wsplin_sp': 'wsplin_sp',
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

    // 假设这是用户的标签
    const userTags = ['管理员'];

    const dummyRequest = ({ file, onSuccess }) => {
        // 模拟上传过程
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const uploadButton = (
        <div>
            <Avatar size={128} src={MaleAvatar} />
            <div style={{ position: 'absolute', right: 0, top: 0 }}>
                <Upload
                    accept="image/*"
                    showUploadList={false}
                    customRequest={dummyRequest}
                    // beforeUpload={beforeUpload} // 实际项目中您需要实现这个函数
                >
                    <Button shape="circle" icon={<EditOutlined />} />
                </Upload>
            </div>
        </div>
    );

    return (
        <Space
            direction="vertical"
            size="middle"
            style={{
                display: 'flex',
                justifyContent: 'center', // 使内容居中
            }}
        >
            <Card title="用户信息设置">
                <Row gutter={24}>
                    <Col span={6}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent:'center', }}>
                            <Col span={8} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                {uploadButton}
                                <h5>JingCheng</h5>
                                <h5>123@qq.com</h5>
                                {userTags.map(tag => (
                                    <Tag key={tag} color='success'>{tag}</Tag>
                                ))}
                            </Col>
                        </div>
                    </Col>
                    <Divider type="vertical" style={{ height: '100%', margin: '20px 0' }} />
                    <Col span={17}>
                        <Form
                            name="userSetting"
                            // onFinish={handleFinish} // 处理表单提交的函数
                        >
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: '请输入您的用户名！' }]}
                            >
                                <Input placeholder="用户名" />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: '请输入您的邮箱！' }]}
                            >
                                <Input placeholder="邮箱" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: '请输入您的密码！' }]}
                            >
                                <Input.Password placeholder="密码" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    提交
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Card>

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
        </Space>
    );
};

export default UserSetting;