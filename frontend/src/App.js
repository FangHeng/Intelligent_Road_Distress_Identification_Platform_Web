import React, {useEffect} from 'react';
import './index.css';
import './App.css';
import 'antd/dist/reset.css';
import zhCN from 'antd/lib/locale/zh_CN';
import {ConfigProvider} from 'antd';
// import {HashRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/Login/login';
import SideBarLayout from './components/MyLayout/SideBarLayout/SideBarLayout';
import Home from './pages/home/Home';
import OverallVisualize from "./pages/visualize/OverallVisualize";
import SubordinateUserRegistration from "./pages/settings/SubordinateUserRegistration";
import UserSetting from "./pages/settings/UserSetting";
import About from "./pages/about/About";
import ImgVisualize from "./pages/visualize/ImgVisualize";
import Detect from "./pages/detect/Detect";
import FAQ from "./pages/QA/FAQ";
import ReleaseNotes from "./pages/releasenotes/ReleaseNotes";
import ModelSelect from "./pages/settings/ModelSelect";
import AddRoad from "./pages/settings/AddRoad";
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import { themeStore } from './store/ThemeStore';
import { theme } from 'antd';
import { observer } from 'mobx-react-lite';
import { App as AntdApp } from 'antd';
import ProtectedRoute from "./pages/ProtectedRoute/ProtectedRoute";
import MoreLayout from "./components/MyLayout/MoreLayout";
import UploadTabs from "./pages/detect/upload/UploadTabs";
import NotFound from "./pages/NotFound/404NotFound";
import Assignments from "./pages/MaintenanceTasks/Assignments";
import AssignmentCreate from "./pages/MaintenanceTasks/AssignmentCreate";
const { darkAlgorithm } = theme;


const App = observer(() => {
  useEffect(() => {
    // 当组件挂载时，尝试从localStorage中读取主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      themeStore.setTheme(savedTheme); // 使用MobX状态管理设置主题
    }
  }, []);

  // 监听主题变化并保存到localStorage
  useEffect(() => {
    localStorage.setItem('theme', themeStore.theme);
  }, [themeStore.theme]);

  return(
      // <Provider themeStore={themeStore}>
      <AntdApp>
        <Router>
          <ConfigProvider
              locale={zhCN}
              theme={themeStore.theme === 'dark' ? { algorithm: darkAlgorithm } : {}}
          >
            <Routes>
              <Route path="/" element={<Navigate replace to="/login" />} />
              <Route path="*" element={<NotFound/>}/>
              <Route path='/login' element={<Login/>}/>
              {/* 使用 MoreLayout 的路由 */}
              <Route path="/more" element={<MoreLayout />}>
                <Route path="/more/FAQ" element={<FAQ />} />
                <Route path="/more/release-notes" element={<ReleaseNotes />} />
              </Route>

              <Route path="/pages/" element={<ProtectedRoute><SideBarLayout/></ProtectedRoute>}>
                <Route path="/pages/home" element={<Home/>}/>
                <Route path="/pages/detect/UploadPhoto" element={<UploadTabs/>}/>
                <Route path="/pages/detect/Detect" element={<Detect/>}/>
                <Route path="/pages/visualize/OverallVisualize" element={<OverallVisualize/>}/>
                <Route path="/pages/visualize/ImgVisualize" element={<ImgVisualize/>}/>

                <Route path={"/pages/MaintenanceTasks/MyAssignments"} element={<Assignments/>}/>
                <Route path={"/pages/MaintenanceTasks/AssignmentsCreate"} element={<AssignmentCreate/>}/>

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
      </AntdApp>
      // </Provider>
  )
});


export default App;


// function App() {
//   console.log(themeStore.theme)
//   return (
//       <Provider themeStore={themeStore}>
//       <Router>
//         <ConfigProvider
//             locale={zhCN}
//             theme={themeStore.theme === 'dark' ? { algorithm: theme.darkAlgorithm } : {}}
//         >
//           <Routes>
//             <Route path='' element={<Login/>}/>
//             <Route path="/qa" element={<QA/>}/>
//             <Route path="/release-notes" element={<ReleaseNotes/>}/>
//             <Route path="/pages/" element={<MyLayout/>}>
//               <Route path="/pages/home" element={<Home/>}/>
//
//               <Route path="/pages/detect/UploadPhoto" element={<Tabs/>}/>
//               <Route path="/pages/detect/Detect" element={<Detect/>}/>
//               <Route path="/pages/visualize/OverallVisualize" element={<OverallVisualize/>}/>
//               <Route path="/pages/visualize/ImgVisualize" element={<ImgVisualize/>}/>
//
//               {/*这是设置*/}
//               <Route path="/pages/settings/UserSetting" element={<UserSetting/>}/>
//               <Route path="/pages/settings/SubordinateUserRegistration" element={<SubordinateUserRegistration/>}/>
//               <Route path="/pages/settings/ModelSelect" element={<ModelSelect/>}/>
//               <Route path="/pages/settings/AddRoad" element={<AddRoad/>}/>
//               <Route path="/pages/about" element={<About/>}/>
//             </Route>
//
//           </Routes>
//
//         </ConfigProvider>
//       </Router>
//       </Provider>
//   )
// }