// ReleaseNotes.js: 版本更新记录
import React from 'react';
import {Anchor, theme} from 'antd';

import { Typography } from 'antd';
import {SmileTwoTone} from "@ant-design/icons";
const { Paragraph, Title } = Typography;

const releaseNotesData = [
    {
        version: '1.0.0',
        date: '2022-01-01',
        notes: [
            '新增了xx功能',
            '修复了xx问题',
            '改进了xx性能',
            // 更多更新内容
        ],
    },
    {
        version: '1.1.0',
        date: '2022-02-01',
        notes: [
            '新增了yy功能',
            '修复了yy问题',
            // 更多更新内容
        ],
    },
    // 更多版本记录
];


const ReleaseNotes = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const anchorItems = releaseNotesData.map(release => ({
        href: `#version-${release.version}`,
        title: release.version,
        key: release.version,
    }));

    return (
        <div style={{ display: 'flex' }}>
            <Anchor items={anchorItems} style={{ marginRight: '20px' }}/>
            <div style={{ flex: 1, background: colorBgContainer, borderRadius: borderRadiusLG, padding: '20px' }}>
                {releaseNotesData.map((release, index) => (
                    <div key={index} id={`version-${release.version}`} style={{ marginBottom: '20px' }}>
                        <Title
                            level={3}
                        >
                            {`版本 ${release.version} - ${release.date}`}<SmileTwoTone style={{ marginLeft:'5px' }}/>
                        </Title>
                        <Paragraph>
                            {release.notes}
                        </Paragraph>
                    </div>
                ))}
            </div>
        </div>
    );
};



export default ReleaseNotes;
