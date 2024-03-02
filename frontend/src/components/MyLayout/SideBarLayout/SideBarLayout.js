import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Layout,
    Menu,
    Tooltip,
    Typography,
    App, Divider, FloatButton, Button,
} from 'antd';
import {useLocation, useNavigate} from 'react-router-dom'
import logo from '../../../assets/img/logo/logo.png'
import logoMini from "../../../assets/img/logo/logo-mini.png";
import logoWhite from "../../../assets/img/logo/logo-white.png";
import logoWhiteMini from "../../../assets/img/logo/logo-mini-white.png";
import {Outlet} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './SideBarlayout.css'
import {
    faHouse,
    faArrowRightFromBracket,
    faGears,
    faCircleInfo,
    faChartColumn,
    faCube, faBarsProgress
} from '@fortawesome/free-solid-svg-icons';
import {
    AlertOutlined,
    ExportOutlined, FileSearchOutlined, LeftOutlined, RightOutlined,
} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import userStore from "../../../store/UserStore";
import uiStore from "../../../store/UIStore";
import roadStore from "../../../store/RoadStore";
import {themeStore} from "../../../store/ThemeStore";

const {Content, Footer, Sider} = Layout;

const {Text} = Typography;

const SideBarLayout = observer(() => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const [openKeys, setOpenKeys] = useState([]);
    const userInfo = userStore.userInfo;

    // 用于控制同时只展开一个子菜单的逻辑
    const onOpenChange = keys => {
        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    };

    // 使用 useLocation 钩子获取当前路由信息
    const location = useLocation();

    const {message,notification} = App.useApp();

    useEffect(() => {
        const fetchInfo = async () => {
            await userStore.fetchUserInfo();
            if (userStore.getInfoHint.status === 'success') {
                if (!userInfo.email || !userInfo.phone_number) {
                    console.log(!userInfo.email || !userInfo.phone_number)
                    console.log(userInfo.email, userInfo.phone_number)
                    notification.warning({
                        message: '请完善您的信息！',
                        description: '您的电子邮件和电话号码是必填项。',
                        placement: 'topRight',
                        duration: 3,
                    });
                }
            }
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

    let selectedLogo;
    if (themeStore.theme === 'dark') {
        selectedLogo = collapsed ? logoWhiteMini : logoWhite;
    } else {
        selectedLogo = collapsed ? logoMini : logo;
    }

    return (
        <App>
            <Layout>
                <Sider
                    collapsible
                    trigger={null}
                    onCollapse={(value) => setCollapsed(value)}
                    collapsed={collapsed}
                    className={'sider-layout'}
                    breakpoint="lg"
                    theme="light"
                >
                    <div className={'logo-container'}>
                        <img src={selectedLogo} alt="logo" style={{ width: '100%' }}/>
                    </div>
                    <Divider style={{marginTop: '1px'}}  orientation="right" plain orientationMargin="0" >
                        <div className={'trigger'}>
                            <Button
                                type="text"
                                shape="circle"
                                size='small' // 增加大小以提高可见性
                                className={'trigger-button'}
                                icon={collapsed ? <RightOutlined/> : <LeftOutlined/>}
                                onClick={() => setCollapsed(!collapsed)}
                            />
                        </div>
                    </Divider>

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
                        onOpenChange={onOpenChange}
                        openKeys={openKeys}
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
                                        label: '账户设置',
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
                                key: '/pages/MaintenanceTasks',
                                icon: <FontAwesomeIcon icon={faBarsProgress} />,
                                label: '任务管理',
                                children: [
                                    {
                                        key: '/pages/MaintenanceTasks/MyAssignments',
                                        label: '我的任务',
                                    },
                                    {
                                        key: '/pages/MaintenanceTasks/AssignmentsCreate',
                                        label: '创建维修任务',
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
                    {/* 用户信息区域 */}
                    <div className={'user-info-container'}>
                        <Divider style={{ margin: '10px 0' }}/>
                        <div className={'user-info-avatar'}>
                            <Avatar size={40} src={avatar}/>
                            {!collapsed && <Text className={'user-info-text'}>{username}</Text>}
                        </div>
                    </div>
                </Sider>

                <Layout
                    style={{
                        marginLeft: collapsed ? '80px' : '200px', // 根据 collapsed 状态动态设置 marginLeft
                    }}
                >

                    <Content className={'content'}>
                        <Outlet/>
                    </Content>
                    <Footer
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        纹影探路 ©{new Date().getFullYear()} Created by InnovateX
                        <div className={'float-button-container'}>
                            <FloatButton.Group
                                trigger="hover"
                                type="default"
                                className={'float-button'}
                                icon={<AlertOutlined />}
                            >
                                <Tooltip title='发布版本' placement="left">
                                    <Tooltip title='发布版本' placement="left">
                                        <FloatButton
                                            onClick={() => handleNavigate('/more/release-notes')}
                                            icon={<ExportOutlined/>}
                                        />
                                    </Tooltip>
                                </Tooltip>
                                <Tooltip title='Q&A' placement="left">
                                    <FloatButton
                                        onClick={() => handleNavigate('/more/FAQ')}
                                        icon={<FileSearchOutlined />}
                                    />
                                </Tooltip>
                            </FloatButton.Group>
                        </div>
                    </Footer>
                </Layout>
            </Layout>
        </App>
    );
});
export default SideBarLayout;