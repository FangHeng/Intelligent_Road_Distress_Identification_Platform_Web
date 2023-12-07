import React from 'react';
import { Tabs } from 'antd';
import UploadFolder from './UploadFolder';
import ImageUploadPage from "./Upload";
const items = [
    {
        key: '1',
        label: `上传图片`,
        children: <ImageUploadPage/>,
    },
    {
        key: '2',
        label: `上传文件夹`,
        children: <UploadFolder/>,
    },
]

const Image2Image =()=>{
    return (
        <div style={{
            marginTop: '-20px',
        }}>
            <Tabs defaultActiveKey="1" items={items} />
        </div>
    )
}

export default Image2Image