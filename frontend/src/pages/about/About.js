import React from 'react';
import { Anchor, Card } from 'antd';
import {PageContainer} from "@ant-design/pro-components";

const About = () => {
    const anchorItems = [
        { href: '#members', title: '成员信息', key: 'members' },
        { href: '#technology', title: '技术展示', key: 'technology' },
    ];

    return (
        <PageContainer>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'start', padding: '20px' }}>
            <div style={{ flex: 4 }}>
                <Card id="members" title="成员信息" style={{ marginBottom: 20 }}>
                    成员信息

                </Card>
                <Card id="technology" title="技术展示">
                    技术展示内容

                </Card>
            </div>
            <div style={{ marginLeft: '20px' }}>
                <Anchor affix={true} offsetTop={80} items={anchorItems} replace/>
            </div>
            </div>
        </PageContainer>
    );
};

export default About;
