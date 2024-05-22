import React from 'react';
import {Breadcrumb, Layout, Menu, theme} from 'antd';
import logo from "../../assets/img/logo/logo.png";
import whiteLogo from "../../assets/img/logo/logo-white.png";
import {Outlet, useLocation, useNavigate} from 'react-router-dom'
import useBreadcrumbItems from "../BreadCrumb/DynamicBreadCrumb";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHouse} from "@fortawesome/free-solid-svg-icons";
import SwitchAppearance from "../AccountSetting/SwitchAppearance";
import {themeStore} from "../../store/ThemeStore";
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

const MoreLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const currentRoute = location.pathname;
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const breadcrumbItems = useBreadcrumbItems();

    return (
        <Layout>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    background: colorBgContainer,
                }}
            >
                <div>
                    {/*<img src={logo} alt="Logo" style={{height: '64px', marginLeft: '-15px'}}/>*/}
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
                    defaultSelectedKeys={['/more/FAQ']}
                    selectedKeys={[currentRoute]}
                    items={items}
                    style={{
                        flex: 1,
                        minWidth: 0,
                    }}
                    onClick={(key) => {
                        navigate(key.key)
                        console.log(key.key)
                    }}
                />
                <div>
                    <SwitchAppearance />
                </div>
            </Header>
            <Content
                style={{
                    padding: '0 48px',
                    minHeight: '86vh',
                }}
            >
                <Breadcrumb
                    style={{
                        margin: '16px 0',
                    }}
                    separator=">"
                    items={[
                        {
                            title: (
                                <>
                                    <FontAwesomeIcon icon={faHouse}/>
                                    <span>首页</span>
                                </>
                            ),
                            href: '/pages/home',
                        },
                        ...breadcrumbItems
                    ]}
                ></Breadcrumb>
                <Outlet />
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                纹影探路 ©{new Date().getFullYear()} Created by InnovateX
            </Footer>
        </Layout>
    );
};
export default MoreLayout;