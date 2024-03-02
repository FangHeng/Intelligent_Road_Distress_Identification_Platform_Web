import React, {useState} from 'react';
import {Button, Card} from 'antd';
import UploadPhoto from './upload/Upload';
import UploadFolder from './upload/UploadFolder';
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRoad} from "@fortawesome/free-solid-svg-icons";

const tabList = [
    {
        key: 'uploadPhoto',
        tab: '上传图片',
    },
    {
        key: 'uploadFolder',
        tab: '上传文件夹',
    },
];
const contentList = {
    uploadPhoto: <UploadPhoto/>,
    uploadFolder: <UploadFolder/>,
};

const UploadNew = () => {
    const [activeTabKey, setActiveTabKey] = useState('uploadPhoto');

    const navigate = useNavigate();

    const onTab1Change = (key) => {
        setActiveTabKey(key);
    };
    return (
        <>
            <Card
                style={{
                    width: '100%',
                }}
                title="上传新图片"
                extra={
                    <Button
                        type="text"
                        onClick={() => {
                            navigate('/pages/settings/AddRoad');
                        }}
                    >
                        <FontAwesomeIcon icon={faRoad} style={{ marginRight: '5px', color: '#faad14' }}/>
                        添加新路段
                    </Button>
                }
                tabList={tabList}
                activeTabKey={activeTabKey}
                onTabChange={onTab1Change}
            >
                {contentList[activeTabKey]}
            </Card>
        </>
    );
};
export default UploadNew;