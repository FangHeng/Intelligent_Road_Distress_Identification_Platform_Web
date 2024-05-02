import {Button, Result, Layout, theme, Menu} from "antd";
import { useNavigate } from 'react-router-dom';
import {themeStore} from "../../store/ThemeStore";
import whiteLogo from "../../assets/img/logo/logo-white.png";
import logo from "../../assets/img/logo/logo.png";
import React from "react";
import {ExportOutlined} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;

const items = [
    {
        key: '/more/FAQ',
        label: '常见问题解答',
    },
    {
        key: '/more/release-notes',
        label: '更新日志',
    },
];

const NotFound = () => {
    const navigate = useNavigate();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (

        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center', background: colorBgContainer, }}>
                <div>
                    {
                        themeStore.theme === 'dark' ? (
                            <img src={whiteLogo} alt="Logo" style={{height: '64px', marginLeft: '-15px'}}/>
                        ) : (
                            <img src={logo} alt="Logo" style={{height: '64px', marginLeft: '-15px'}}/>
                        )
                    }
                </div>
                <Menu
                    theme="light"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    items={items}
                    style={{ flex: 1, minWidth: 0 }}
                />
                <div >
                    {/*<Button type="text" onClick={() => navigate('/login')}>登录</Button>*/}
                    <Button type="link" onClick={() => navigate('/more/learn')}>尝试纹影探路 <ExportOutlined /> </Button>
                </div>
            </Header>
            <Content style={{
                height: `calc(100vh - 135px)`,
            }}>

                    <Result
                        status="404"
                        title="404"
                        subTitle="对不起，你访问的页面不存在。"
                        extra={<Button type="primary" onClick={() => navigate('/pages/home')}>返回首页</Button>}
                    />

            </Content>
            <Footer style={{ textAlign: 'center' }}>
                纹影探路 ©{new Date().getFullYear()} Created by InnovateX
            </Footer>
        </Layout>


    );
}

export default NotFound;