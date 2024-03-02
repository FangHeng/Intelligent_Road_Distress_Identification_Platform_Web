// upload/UploadTabs.js
import React from 'react';
import {Button, Tabs} from 'antd';
import UploadFolder from './UploadFolder';
import ImageUpload from "./Upload";
import {PageContainer} from "@ant-design/pro-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRoad} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
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
            <FontAwesomeIcon icon={faRoad} style={{ marginRight: '5px', color: '#faad14' }}/>
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