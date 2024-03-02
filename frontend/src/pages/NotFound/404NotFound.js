import {Button, Result} from "antd";
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <Result
            status="404"
            title="404"
            subTitle="对不起，你访问的页面不存在。"
            extra={<Button type="primary" onClick={() => navigate('/pages/home')}>返回首页</Button>}
        />
    );
}

export default NotFound;