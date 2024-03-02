// Appearance.js
import React, {} from 'react';
import { observer } from 'mobx-react-lite';
import {Avatar, Divider, Select, Space, Typography} from 'antd';
import { themeStore } from '../../store/ThemeStore'
import {CheckCard} from "@ant-design/pro-components";
import { ReactComponent as MoonIcon } from '../../assets/icons/moon.svg';
import { ReactComponent as SunIcon } from '../../assets/icons/sun.svg';

const {Title, Text} = Typography;

const Appearance = observer(() => {

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    const theme = themeStore.theme;
    const toggleTheme = (value) => {
        themeStore.setTheme(value);
        localStorage.setItem('theme', value); // 将用户选择的主题保存到localStorage
    };

    return (
        <div>
            <div style={{ margin: '0 20' }}>
            <Title level={4}>其他设置</Title>
            <Divider />
        </div>
            <Space direction='vertical' style={{ width: '100%' }}>
                <div>
                    <Title level={5}>系统外观</Title>
                    <Text type='secondary'>根据偏好选择系统的外观。</Text>
                </div>
                <CheckCard.Group
                    onChange={toggleTheme}
                    defaultValue={theme} // 设置默认值为当前主题
                >
                    <CheckCard
                        title="浅色主题"
                        description="Light Mode"
                        value="light"
                        avatar={
                            <Avatar
                                src={<SunIcon />}
                                size="large"
                            />
                        }
                    />
                    <CheckCard
                        title="深色主题"
                        description="Dark Mode"
                        avatar={
                            <Avatar
                                src={<MoonIcon />}
                                size="large"
                            />
                        }
                        value="dark" />
                </CheckCard.Group>
                <div>
                    <Title level={5}>系统语言</Title>
                    <Text type='secondary'>切换系统语言。</Text>
                </div>
                <Select
                    defaultValue="中文"
                    style={{
                        width: '20vw',
                    }}
                    size={'middle'}
                    onChange={handleChange}
                    options={[
                        {
                            value: 'Chinese',
                            label: '中文',
                        },
                        {
                            value: 'English',
                            label: 'English',
                            disabled: true,
                        },
                        // {
                        //     value: 'Yiminghe',
                        //     label: 'yiminghe',
                        // },
                        // {
                        //     value: 'disabled',
                        //     label: 'Disabled',
                        //     disabled: true,
                        // },
                    ]}
                />
            </Space>

        </div>
    );
});

export default Appearance;
