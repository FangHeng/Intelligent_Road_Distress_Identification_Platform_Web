import React, {useEffect} from 'react';
import { Layout, Input, Collapse, Breadcrumb } from 'antd';
import {Link} from "react-router-dom";
import uiStore from "../../store/UIStore";
import {HomeOutlined} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Panel } = Collapse;

const releaseNotes = [
    // 示例发布日志数据
    { version: "1.0.0", content: "这是版本 1.0.0 的发布说明。" },
    { version: "1.1.0", content: "这是版本 1.1.0 的发布说明。" },
    // 更多版本...
];

const ReleaseNotes = () => {
    useEffect(() => {
        // 当主页加载完成，停止进度条
        uiStore.stopLoading();
    }, []);

    return (
        <Layout className="layout" style={{ minHeight: '100vh' }}>
            <Header style={{ background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ color: '#000', fontSize: '20px' }}>版本发布公告</div>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><Link to="/pages/home"><HomeOutlined  style={{ marginRight: '4px' }}/>首页</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>版本发布公告</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content" style={{ background: 'white', padding: 24, minHeight: 280 }}>
                    <Search placeholder="搜索版本" style={{ marginBottom: 16 }} />
                    <Collapse>
                        {releaseNotes.map((note, index) => (
                            <Panel header={`版本 ${note.version}`} key={index}>
                                <p>{note.content}</p>
                            </Panel>
                        ))}
                    </Collapse>
                </div>
            </Content>
        </Layout>
    );
};

export default ReleaseNotes;
