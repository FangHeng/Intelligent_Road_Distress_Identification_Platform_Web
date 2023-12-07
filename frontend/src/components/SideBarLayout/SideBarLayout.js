import {Button, Layout, Menu, theme, message, Divider, Tooltip, Avatar, Typography, FloatButton} from 'antd'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MaleAvatar from '../../assets/Male.png'
import logo from '../../assets/logo.png'
import logo_mini from '../../assets/logo-mini.png'
import { Outlet } from 'react-router-dom'
import { getCookie } from '../../utils/utils'
import deleteCookie from '../../utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faArrowRightFromBracket, faGears, faCircleInfo, faChartColumn, faCube } from '@fortawesome/free-solid-svg-icons';
import {
    LineOutlined, ExportOutlined, FileSearchOutlined, AlertOutlined
} from "@ant-design/icons";
import { observer } from 'mobx-react-lite'
import {userStore} from '../../store/userStore'

const { Text } = Typography
const { Sider, Content, Footer } = Layout

const SideBarLayout = observer(() => {
    const [collapsed, setCollapsed] = useState(false)
    const navigate = useNavigate()
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    useEffect(() => {
        userStore.fetchUserInfo();
        const {loginHint} = userStore
        if (loginHint.status === 'success'){
            message.success('登陆成功！')
        }
    }, [])

    // 使用 userStore 中的用户数据
    const { username, avatar } = userStore.userInfo;

    return (
        <Layout style={{ width: '100vw', height: '100vh', overflow: 'initial'}}>
            <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
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
                <div
                    style={{
                        position: 'absolute', // 绝对定位
                        top: '50%', // 顶部对齐
                        right: 0, // 右侧对齐
                        transform: 'translateX(100%)', // 沿X轴向右移动100%，即移动到Sider外部
                        zIndex: 1, // 确保按钮在Sider之上
                    }}
                >
                    <Tooltip title='收起或展开侧边栏' style={{ color: 'gray' }}>
                    <Button
                        type="text"

                        icon={
                            <LineOutlined style={{ transform: 'rotate(90deg)', color: 'grey' }} />
                            // <FontAwesomeIcon icon={faBars} style={{ transform: 'rotate(90deg)', color: 'grey' }} />
                        } // 使用 FontAwesome 图标，并旋转90度，设置颜色为灰色
                        onClick={() => setCollapsed(!collapsed)}
                    />
                    </Tooltip>
                </div>
                {/* 用户信息区域 */}
                <div style={{ position: 'absolute', bottom: 0, width: '100%', alignItems:'center' }}>
                    <Divider></Divider>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent:'center', marginBottom:'10px' }}>
                        <Avatar size={40} src={avatar || MaleAvatar} />
                        {!collapsed && <Text style={{ marginLeft: '10px', color: 'rgba(0, 0, 0, 0.65)' }}>{username}</Text>}
                    </div>
                </div>

            </Sider>
            <Layout style={{ overflow: 'auto' }}>
                <Content
                    style={{
                        margin: '0px 8px',
                        padding: 24,
                        minHeight: 280,
                        // background: colorBgContainer,
                    }}
                >
                    <Outlet />
                    <div style={{ position: 'fixed', bottom: '5px', right: '5px' }}>
                        <FloatButton.Group
                            trigger="hover"
                            type="default"
                            style={{ right: 20, bottom: 10 }}
                            icon={<AlertOutlined />}
                        >
                            <Tooltip title='发布版本' placement="left">
                            <FloatButton target='_blank' href='/#/release-notes' icon={<ExportOutlined/>}/>
                            </Tooltip>
                            <Tooltip title='Q&A' placement="left">
                            <FloatButton target='_blank' href='/#/qa' icon={<FileSearchOutlined />} />
                            </Tooltip>
                        </FloatButton.Group>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}></Footer>
            </Layout>
        </Layout>
    )
})

export default SideBarLayout
