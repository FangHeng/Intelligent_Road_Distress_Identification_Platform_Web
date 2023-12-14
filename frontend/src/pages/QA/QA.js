import React, {useEffect} from 'react';
import { Layout, Menu, Input, Collapse, Button, Breadcrumb } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './header.css'
import {Link} from "react-router-dom";
import {uiStore} from "../../store/UIStore";

const { Header, Content } = Layout;
const { Search } = Input;
const { Panel } = Collapse;

const questions = [
    // 示例问题数据
    { title: "问题 1", content: "这是问题 1 的回答。" },
    { title: "问题 2", content: "这是问题 2 的回答。" },
    // 更多问题...
];

const QA = () => {
    useEffect(() => {
        // 当主页加载完成，停止进度条
        uiStore.stopLoading();
    }, []);

    return (
        <Layout className="layout" style={{ minHeight: '100vh' }}>
            <Header style={{ background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ color: '#000', fontSize: '20px' }}>常见问题解答</div>
                <Menu
                    theme="light"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    style={{ position: 'absolute', right: 0 }}
                >
                    {/* 菜单项 */}
                </Menu>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item ><Link to="/pages/home">首页</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>QA</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content" style={{ background: 'white', padding: 24, minHeight: 280 }}>
                    <Search placeholder="搜索问题" style={{ marginBottom: 16 }} />
                    <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
                        提问
                    </Button>
                    <Collapse>
                        {questions.map((q, index) => (
                            <Panel header={q.title} key={index}>
                                <p>{q.content}</p>
                            </Panel>
                        ))}
                    </Collapse>
                </div>
            </Content>
        </Layout>
    );
};

export default QA;
