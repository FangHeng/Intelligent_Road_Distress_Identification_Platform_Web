import React, { useEffect, useState } from 'react'
import './home.css'
import {Card, Button, Row, Col, Avatar, Empty, Spin, Tag, Space,} from 'antd'
import {
  IdcardOutlined,
  PictureOutlined, ReconciliationOutlined,
  UserOutlined,
} from '@ant-design/icons'
import services from './services'
import userStore from '../../store/UserStore'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import NoticeEmpty from '../../assets/img/empty.png'
import initHomeMap from '../../components/Graph/HomeMap'
import DemoBar from '../../components/Graph/BarGraph'
import DemoScatter from '../../components/Graph/ScatterGraph'

const { Meta } = Card
const Home = observer(() => {
  const [scene, setScene] = useState(null)
  const [mapLoading, setMapLoading] = useState(true)

  useEffect(() => {
    const newScene = initHomeMap();
    setMapLoading(false);
    setScene(newScene);

  }, [])
  const { userInfo } = userStore
  return (
    <div className="site-layout-content">
      <Row gutter={16}>
        <Col span={8}>
          <Card className="card">
            <Meta
              avatar={
                <Avatar
                  src={userStore.getAvatarUrl()}
                  size={64}
                  icon={<UserOutlined />}
                />
              }
              title={`${userInfo.username}，祝您今天开心！`}
              description={
                <Space>
                  <Tag icon={<ReconciliationOutlined />} color="magenta" >{userInfo.company_name}</Tag>
                  <Tag icon={<UserOutlined />} color="blue">{userInfo.user_level}</Tag>
                </Space>
              }
            />
            <Row gutter={16} style={{ marginTop: '2vh' }}>
              <Col span={12}>
                <Card bordered={false}>
                  <div>
                    <span className="info-title">您的工号</span>
                    <span className="info-content">
                      <IdcardOutlined
                        style={{ marginRight: '0.4vh', fontSize: '2.5vh' }}
                      />
                      {userInfo.employee_number}
                    </span>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false}>
                  <div>
                    <span className="info-title">图片上传数量</span>
                    <span className="info-content-img">
                      <PictureOutlined
                        style={{ marginRight: '0.4vh', fontSize: '2.5vh' }}
                      />
                        {userInfo.upload_count}
                    </span>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="常用服务" bordered={false} className="card">
            <Row gutter={16}>
              {services.map((service, index) => (
                <Col key={index} span={12} style={{ marginBottom: 16 }}>
                  <Link to={service.link}>
                    <Button type="link" style={{ color: 'black' }}>
                      <service.icon className="service-icon" />
                      {service.name}
                    </Button>
                  </Link>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="通知公告" bordered={false} className="card">
            <Empty
              description={false}
              image={NoticeEmpty}
              imageStyle={{
                height: 130,
              }}
            />
          </Card>
        </Col>
      </Row>
      {/* 第二排卡片，第一个卡片占两个位置 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card bordered={false} className="secondRowCard">
            {mapLoading ? (
                <div style={{ height: "65vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Spin tip={'正在加载...'}>
                      <div className='content'></div>
                    </Spin>

                </div>
            ) : (
                <div style={{ height: "65vh", justifyContent: "center", position: "relative" }} id="homeMap" />
            )}
          </Card>
        </Col>
        <Col span={8}>
          {/* 在这个Col中垂直分出两个Card */}
          <Row gutter={[0, 16]}>
            {' '}
            {/* 添加垂直间隔 */}
            <Col span={24}>
              <DemoBar />
            </Col>
            <Col span={24}>
              <DemoScatter />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
})

export default Home
