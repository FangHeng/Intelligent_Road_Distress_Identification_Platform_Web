import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'antd/dist/reset.css';
import zhCN from 'antd/lib/locale/zh_CN';
import {ConfigProvider} from 'antd';
import {HashRouter, Routes, Route} from 'react-router-dom';
import LoginPage from './pages/Login/login';
import SideBarLayout from './components/SideBarLayout/SideBarLayout';

import Home from "./pages/home/home";
import SubordinateUserRegistration from "./pages/settings/SubordinateUserRegistration";
import UserSetting from "./pages/settings/UserSetting";
import About from "./pages/about/About";
import Visualize from "./pages/visualize/Visualize";
import Detect from "./pages/detect/Detect";
import Tabs from "./pages/detect/upload/Tabs";
import QA from "./pages/QA/QA";
import ReleaseNotes from "./pages/releasenotes/ReleaseNotes";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <HashRouter>

        <ConfigProvider locale={zhCN}>
            <Routes>
                <Route path='' element={<LoginPage/>}/>
                <Route path="/qa" element={<QA/>}/>
                <Route path="/release-notes" element={<ReleaseNotes/>}/>
                <Route path="/pages/" element={<SideBarLayout/>}>
                    <Route path="/pages/home" element={<Home/>}/>

                    <Route path="/pages/detect/UploadPhoto" element={<Tabs/>}/>
                    <Route path="/pages/detect/Detect" element={<Detect/>}/>
                    <Route path="/pages/visualize" element={<Visualize/>}/>
                    {/*这是设置*/}
                    <Route path="/pages/settings/UserSetting" element={<UserSetting/>}/>
                    <Route path="/pages/settings/SubordinateUserRegistration" element={<SubordinateUserRegistration/>}/>
                    <Route path="/pages/about" element={<About/>}/>


                </Route>
            </Routes>

        </ConfigProvider>
    </HashRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
