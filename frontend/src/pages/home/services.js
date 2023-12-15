import { ReactComponent as UploadIcon } from '../../assets/icons/upload.svg';
import { ReactComponent as DetectHistoryIcon } from '../../assets/icons/detectHistory.svg';
import { ReactComponent as SettingIcon } from '../../assets/icons/setting.svg';
import { ReactComponent as AddRoadIcon } from '../../assets/icons/addRoad.svg';
import { ReactComponent as ModelIcon } from '../../assets/icons/model.svg';
import { ReactComponent as RegisterIcon } from '../../assets/icons/register.svg';

const services = [
    { name: '上传图片', icon: UploadIcon, link: '/pages/detect/UploadPhoto' },
    { name: '检测记录', icon: DetectHistoryIcon, link: '/pages/detect/Detect' },
    { name: '添加道路', icon: AddRoadIcon, link: '/pages/settings/AddRoad' },
    { name: '模型选择', icon: ModelIcon, link: '/pages/settings/ModelSelect' },
    { name: '个人信息设置', icon: SettingIcon, link: '/pages/settings/UserSetting' },
    { name: '注册下属用户', icon: RegisterIcon, link: '/pages/settings/SubordinateUserRegistration' }
];

export default services;
