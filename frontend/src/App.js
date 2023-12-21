import React from 'react';
import './index.css';
import './App.css';
import 'antd/dist/reset.css';
import zhCN from 'antd/lib/locale/zh_CN';
import {ConfigProvider} from 'antd';
// import {HashRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/Login/login';
import SideBarLayout from './components/SideBarLayout/SideBarLayout';
import Home from './pages/home/Home';
import OverallVisualize from "./pages/visualize/OverallVisualize";
import SubordinateUserRegistration from "./pages/settings/SubordinateUserRegistration";
import UserSetting from "./pages/settings/UserSetting";
import About from "./pages/about/About";
import ImgVisualize from "./pages/visualize/ImgVisualize";
import Detect from "./pages/detect/Detect";
import Tabs from "./pages/detect/upload/Tabs";
import QA from "./pages/QA/QA";
import ReleaseNotes from "./pages/releasenotes/ReleaseNotes";
import ModelSelect from "./pages/settings/ModelSelect";
import AddRoad from "./pages/settings/AddRoad";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// import {theme} from "antd";
// //
// const { darkAlgorithm, compactAlgorithm } = theme;

function App() {
  // const theme = {
  //   algorithm: [darkAlgorithm],
  // };
  return(
      // <HashRouter>
      <Router>
        <ConfigProvider
            locale={zhCN}
            // theme={theme}
        >
          <Routes>
            <Route path='' element={<Login/>}/>
            <Route path="/qa" element={<QA/>}/>
            <Route path="/release-notes" element={<ReleaseNotes/>}/>
            <Route path="/pages/" element={<SideBarLayout/>}>
              <Route path="/pages/home" element={<Home/>}/>

              <Route path="/pages/detect/UploadPhoto" element={<Tabs/>}/>
              <Route path="/pages/detect/Detect" element={<Detect/>}/>
              <Route path="/pages/visualize/OverallVisualize" element={<OverallVisualize/>}/>
              <Route path="/pages/visualize/ImgVisualize" element={<ImgVisualize/>}/>

              {/*这是设置*/}
              <Route path="/pages/settings/UserSetting" element={<UserSetting/>}/>
              <Route path="/pages/settings/SubordinateUserRegistration" element={<SubordinateUserRegistration/>}/>
              <Route path="/pages/settings/ModelSelect" element={<ModelSelect/>}/>
              <Route path="/pages/settings/AddRoad" element={<AddRoad/>}/>
              <Route path="/pages/about" element={<About/>}/>
            </Route>

          </Routes>

        </ConfigProvider>
      </Router>
      // </HashRouter>
  )
}

export default App;
