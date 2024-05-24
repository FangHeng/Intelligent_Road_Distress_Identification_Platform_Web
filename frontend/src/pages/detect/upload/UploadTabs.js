// upload/UploadTabs.js
import React from 'react';
import {Button, Tabs} from 'antd';
import UploadFolder from './UploadFolder';
import ImageUpload from "./Upload";
import {PageContainer} from "@ant-design/pro-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRoad} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import UploadCompressed from "./UploadCompressed";
import '../css/checkbox.css'

const items = [
    {
        key: '1',
        label: `上传图片`,
        children: <ImageUpload/>,
    },
    {
        key: '2',
        label: `上传文件夹`,
        children: <UploadFolder/>,
    },
    {
        key: '3',
        label: `上传图片压缩包`,
        children: <UploadCompressed/>,
    },
]


const UploadTabs =()=>{
    const navigate = useNavigate();

    const operations =
        <Button
            type="link"
            onClick={() => {
                navigate('/pages/settings/AddRoad');
            }}
        >
            <FontAwesomeIcon icon={faRoad} style={{ marginRight: '5px'}}/>
            添加新路段
        </Button>

    return (
        <PageContainer
            header={{
                title: '上传图片',
            }}
            extra={[

            ]}
            >
            <Tabs defaultActiveKey="1" items={items} tabBarExtraContent={operations}/>
        </PageContainer>
    )
}

export default UploadTabs;