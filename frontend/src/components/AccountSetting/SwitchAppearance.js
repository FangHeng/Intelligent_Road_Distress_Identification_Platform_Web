// Appearance.js
import React, {} from 'react';
import { observer } from 'mobx-react-lite';
import {Switch} from 'antd';
import { themeStore } from '../../store/ThemeStore'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMoon, faSun} from "@fortawesome/free-solid-svg-icons";


const SwitchAppearance = observer(() => {


    const toggleTheme = (checked) => {
        // 根据 `checked` 值确定主题是 'dark' 还是 'light'
        const newTheme = checked ? 'dark' : 'light';

        // 更新主题状态
        themeStore.setTheme(newTheme);

        // 保存到localStorage
        localStorage.setItem('theme', newTheme);
    };


    return (
        <div>
            <Switch
                checkedChildren={<FontAwesomeIcon icon={faMoon}  style={{ color: 'lightgrey' }} />}
                unCheckedChildren={<FontAwesomeIcon icon={faSun} style={{ color: 'orange' }} />}
                onChange={toggleTheme}
                checked={themeStore.theme === 'dark'} // 设置根据主题状态来设置开关状态
            />
        </div>
    );
});

export default SwitchAppearance;
