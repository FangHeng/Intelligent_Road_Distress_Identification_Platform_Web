import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Button,
    Col,
    Dropdown,
    Layout,
    Menu,
    Row,
    Space,
    theme,
    Tooltip,
    Typography,
    App, Divider
} from 'antd';
import {useLocation, useNavigate} from 'react-router-dom'
import logo from '../../assets/img/logo/logo.png'
import {Outlet} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faHouse,
    faArrowRightFromBracket,
    faGears,
    faCircleInfo,
    faChartColumn,
    faCube, faUser
} from '@fortawesome/free-solid-svg-icons';
import {
    BellOutlined,
    ExportOutlined, LineOutlined, QuestionCircleOutlined,
} from "@ant-design/icons";
import Appearance from "../AccountSetting/Appearance";
import {observer} from "mobx-react-lite";
import userStore from "../../store/UserStore";
import uiStore from "../../store/UIStore";
import roadStore from "../../store/RoadStore";
import logo_mini from "../../assets/img/logo/logo-mini.png";

const {Header, Content, Footer, Sider} = Layout;
// 用户信息菜单
const items = [
    {
        key: '/pages/settings/UserSetting',
        icon: <FontAwesomeIcon icon={faUser}/>,
        label: (
            <a href="/pages/settings/UserSetting">
                个人信息
            </a>
        ),
    },
    // {
    //     type: 'divider',
    // },
]

const {Text} = Typography;

const SideBarLayoutTest = observer(() => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    // 使用 useLocation 钩子获取当前路由信息
    const location = useLocation();

    const {message} = App.useApp();

    useEffect(() => {
        const fetchInfo = async () => {
            await userStore.fetchUserInfo();

            if (userStore.getInfoHint.status === 'error') {
                message.error(userStore.getInfoHint.message);
            }
        };

        fetchInfo();
    }, [message]);

    useEffect(() => {
        // 当主页加载完成，停止进度条
        uiStore.stopLoading();
    }, []);

    // 获取道路数据以便多个页面使用
    useEffect(() => {
        const fetchRoads = async () => {
            await roadStore.fetchRoadData();
        };

        fetchRoads();
    }, []);

    const handleNavigate = (path) => {
        // 在新窗口中打开页面
        window.open(path, '_blank');
    };

    // 使用 userStore 中的用户数据
    const {username, avatar} = userStore.userInfo;
    // 当前路由路径
    const currentRoute = location.pathname;
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 0;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        // 添加滚动事件监听器
        window.addEventListener('scroll', handleScroll);

        // 清理函数
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    return (
        <App>
            <Layout>
                {/*<Header*/}
                {/*    style={{*/}
                {/*        height: 64,*/}
                {/*        padding: '0 20px',*/}
                {/*        position: 'fixed', zIndex: 1, width: '100%',*/}
                {/*        background: colorBgContainer,*/}
                {/*        opacity: scrolled ? 0.5 : 1, // 当页面滚动时，设置透明度为 0.5*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <Row justify="space-between">*/}
                {/*        <Col xs={16} sm={16} md={16} lg={12} xl={12}>*/}
                {/*            <img src={logo} alt="Logo" style={{height: '64px', marginLeft: '-15px'}}/>*/}
                {/*        </Col>*/}
                {/*        <Col xs={4} sm={4} md={6} lg={0} xl={0}>*/}
                {/*            <Row justify="end" style={{*/}
                {/*                marginTop: '10px',*/}
                {/*            }}>*/}
                {/*                <Dropdown menu={{items}}>*/}
                {/*                    <Button type='text' onClick={(e) => e.preventDefault()} size='large'>*/}
                {/*                        <Avatar size={30} src={avatar}/>*/}
                {/*                        <Text style={{marginLeft: '10px'}}>{username}</Text>*/}
                {/*                    </Button>*/}
                {/*                </Dropdown>*/}
                {/*            </Row>*/}
                {/*        </Col>*/}
                {/*        <Col xs={0} sm={0} md={0} lg={12} xl={12}>*/}
                {/*            <Row justify="end">*/}
                {/*                /!* 用户头像和下拉菜单 *!/*/}
                {/*                <Space>*/}
                {/*                    <Dropdown menu={{items}}>*/}
                {/*                        <Button type='text' onClick={(e) => e.preventDefault()} size='large'>*/}
                {/*                            <Avatar size={30} src={avatar}/>*/}
                {/*                            <Text style={{marginLeft: '10px'}}>{username}</Text>*/}
                {/*                        </Button>*/}
                {/*                    </Dropdown>*/}
                {/*                    <Tooltip title='消息' placement="bottom">*/}
                {/*                        <Button*/}
                {/*                            type='text'*/}
                {/*                            // onClick={() => handleNavigate('/release-notes')}*/}
                {/*                            icon={<BellOutlined/>}*/}
                {/*                        />*/}
                {/*                    </Tooltip>*/}
                {/*                    <Tooltip title='发布版本' placement="bottom">*/}
                {/*                        <Button*/}
                {/*                            type='text'*/}
                {/*                            onClick={() => handleNavigate('/more/release-notes')}*/}
                {/*                            icon={<ExportOutlined/>}*/}
                {/*                        />*/}
                {/*                    </Tooltip>*/}

                {/*                    <Tooltip title='Q&A' placement="bottom">*/}
                {/*                        <Button*/}
                {/*                            type='text'*/}
                {/*                            onClick={() => handleNavigate('/more/FAQ')}*/}
                {/*                            icon={<QuestionCircleOutlined/>}*/}
                {/*                        />*/}
                {/*                    </Tooltip>*/}
                {/*                    <Appearance/>*/}
                {/*                </Space>*/}
                {/*            </Row>*/}
                {/*        </Col>*/}
                {/*    </Row>*/}
                {/*</Header>*/}
                <Layout>
                    <Sider
                        collapsible
                        trigger={null}
                        collapsed={collapsed}
                        style={{
                            overflow: 'auto',
                            height: '100vh',
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            bottom: 0,
                        }}
                        breakpoint="lg"
                        theme="light"
                    >
                        <div style={{display: 'flex', alignItems: 'center', justifyContent:'center', marginTop:'5px'}}>
                            {collapsed
                                ? <img src={logo_mini} alt="logo" style={{ width: '100%' }} />
                                : <img src={logo} alt="logo" style={{ width: '100%'}} />
                            }
                        </div>
                        <Divider style={{ marginTop:'1px' }}></Divider>
                        <Menu
                            // theme="white"
                            mode="inline"
                            onClick={(key) => {
                                if (key.key === '/logout') {
                                    userStore.logout();
                                    navigate('/');
                                    return;
                                }
                                navigate(key.key)
                                console.log(key.key)
                            }}
                            defaultSelectedKeys={['1']}
                            selectedKeys={[currentRoute]}
                            items={[
                                {
                                    key: '/pages/home',
                                    icon: <FontAwesomeIcon icon={faHouse}/>,
                                    label: '首页',
                                },
                                {
                                    key: '/pages/detect',
                                    icon: <FontAwesomeIcon icon={faCube}/>,
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
                                    icon: <FontAwesomeIcon icon={faChartColumn}/>,
                                    label: '结果可视化',
                                    children: [
                                        {
                                            key: '/pages/visualize/OverallVisualize',
                                            label: '总体可视化',
                                        },
                                        {
                                            key: '/pages/visualize/ImgVisualize',
                                            label: '图片可视化',
                                        },
                                    ],
                                },
                                {
                                    key: '/pages/settings',
                                    icon: <FontAwesomeIcon icon={faGears}/>,
                                    label: '设置',
                                    children: [
                                        {
                                            key: '/pages/settings/UserSetting',
                                            label: '个人信息',
                                        },
                                        {
                                            key: '/pages/settings/AddRoad',
                                            label: '添加道路',
                                        },
                                        {
                                            key: '/pages/settings/ModelSelect',
                                            label: '模型选择',
                                        },
                                        {
                                            key: '/pages/settings/SubordinateUserRegistration',
                                            label: '下属用户注册',
                                        },

                                    ],
                                },
                                {
                                    key: '/pages/about',
                                    icon: <FontAwesomeIcon icon={faCircleInfo}/>,
                                    label: '关于我们',
                                },
                                {
                                    key: '/logout',
                                    icon: <FontAwesomeIcon icon={faArrowRightFromBracket}/>,
                                    label: '退出',
                                },

                            ]}
                        />
                        <div
                            style={{
                                position: 'absolute', // 绝对定位
                                top: '50%', // 顶部对齐
                                right: 1, // 右侧对齐
                                transform: 'translateX(100%)', // 沿X轴向右移动100%，即移动到Sider外部
                                zIndex: 1, // 确保按钮在Sider之上
                            }}
                        >
                            <Tooltip title='收起或展开侧边栏' style={{ color: 'gray' }}>
                                <Button
                                    type="text"
                                    icon={
                                        <LineOutlined style={{ transform: 'rotate(90deg)', color: 'grey' }} />
                                    }
                                    onClick={() => setCollapsed(!collapsed)}
                                />
                            </Tooltip>
                        </div>
                        {/* 用户信息区域 */}
                        <div style={{ position: 'absolute', bottom: 0, width: '100%', alignItems:'center' }}>
                            <Divider></Divider>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent:'center', marginBottom:'10px' }}>
                                <Avatar size={40} src={avatar} />
                                {!collapsed && <Text style={{ marginLeft: '10px'}}>{username}</Text>}
                            </div>
                        </div>
                    </Sider>
                    <Layout
                        style={{
                            marginLeft: collapsed ? '80px' : '200px', // 根据 collapsed 状态动态设置 marginLeft
                        }}
                    >

                        <Content
                            style={{
                                margin: '20px 12px 0',
                                overflow: 'initial',
                                minHeight: '85vh',
                            }}
                        >
                            <Outlet/>
                        </Content>
                        <Footer
                            style={{
                                textAlign: 'center',
                            }}
                        >
                            纹影探路 ©{new Date().getFullYear()} Created by InnovateX
                        </Footer>
                    </Layout>
                </Layout>
            </Layout>
        </App>
    );
});
export default SideBarLayoutTest;