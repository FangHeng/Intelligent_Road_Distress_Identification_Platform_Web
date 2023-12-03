import React from 'react';
import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    ShopOutlined,
    TeamOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import deleteCookie from "../../utils/utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowRightFromBracket,
    faChartColumn,
    faCircleInfo,
    faCube,
    faGears,
    faHouse
} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import { Outlet } from 'react-router-dom'
const { Header, Content, Footer, Sider } = Layout;


const SideBarLayoutTest = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const navigate = useNavigate()
    return (
        <Layout hasSider>
            <Sider
                style={{
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
                theme="light"
            >
                <div className="demo-logo-vertical" />
                <Menu
                    // theme="white"
                    mode="inline"
                    onClick={(key) => {
                        if (key.key === '/') {
                            deleteCookie('isLogin')
                            localStorage.removeItem('messages')
                        }
                        navigate(key.key)
                        console.log(key.key)
                    }}
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '/pages/home',
                            icon: <FontAwesomeIcon icon={faHouse} />,
                            label: '首页',
                        },
                        {
                            key: '/pages/detect',
                            icon: <FontAwesomeIcon icon={faCube} />,
                            label: '进行检测',
                            children: [
                                {
                                    key: '/pages/detect/UploadPhoto',
                                    label: '上传图片',
                                },
                                {
                                    key: '/pages/detect/Detect',
                                    label: '检测记录',
                                },
                            ],
                        },

                        {
                            key: '/pages/visualize',
                            icon: <FontAwesomeIcon icon={faChartColumn} />,
                            label: '可视化结果',
                        },
                        {
                            key: '/pages/settings',
                            icon: <FontAwesomeIcon icon={faGears} />,
                            label: '设置',
                            children: [
                                {
                                    key: '/pages/settings/UserSetting',
                                    label: '个人信息',
                                },
                                {
                                    key: '/pages/settings/SubordinateUserRegistration',
                                    label: '下属用户注册',
                                },
                            ],
                        },
                        {
                            key: '/pages/about',
                            icon: <FontAwesomeIcon icon={faCircleInfo} />,
                            label: '关于我们',
                        },
                        {
                            key: '/logout',
                            icon: <FontAwesomeIcon icon={faArrowRightFromBracket} />,
                            label: '退出',
                        },

                    ]}
                />
            </Sider>
            <Layout
                className="site-layout"
                style={{
                    marginLeft: 200,
                }}
            >
                <Content
                    style={{
                        margin: '24px 16px 0',

                    }}
                >
                    <Outlet/>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Ant Design ©2023 Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};
export default SideBarLayoutTest;