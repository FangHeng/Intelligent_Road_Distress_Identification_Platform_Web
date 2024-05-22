// Home.js
import React, { useEffect } from 'react'
import './home.css'
import {
  Card,
  Row,
  Col,
  Avatar,
  Tag,
  App,
  Statistic,
  Divider,
  List, Typography, Button, Spin,
} from 'antd'
import {
  PictureTwoTone, PushpinTwoTone, ReconciliationOutlined,
  UserOutlined,
} from '@ant-design/icons'
import services from './services'
import userStore from '../../store/UserStore'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import initHomeMap from '../../components/Graph/HomeMap'
import HomeRoadCard from "../../components/Card/HomeRoadCard";
import HomeBulletGraph from "../../components/Graph/HomeBulletGraph";
import historyStore from "../../store/HistoryStore";
import {PageContainer} from "@ant-design/pro-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMoon, faSun} from "@fortawesome/free-solid-svg-icons";


const Home = observer(() => {
  const [dataLoaded, setDataLoaded] = React.useState(false);
  const {isLoading} = historyStore;
  const {message} = App.useApp();
  const userInfo = userStore.userInfo;


  useEffect(() => {
    const loadData = async () => {
      await historyStore.fetchUploadRecords();
    };

    loadData().then(() => {
        setDataLoaded(true);
    }).catch((error) => {
      setDataLoaded(true);
      console.error('Fetching upload records failed:', error);
      message.error('加载历史记录失败！');
    });

    // if (!dataLoaded) {
    //   loadData().then(() => {
    //     console.log(isLoading, dataLoaded)
    //   }).catch((error) => {
    //     console.error('Fetching upload records failed:', error);
    //     message.error('加载历史记录失败！');
    //   });
    // }
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      const scene = initHomeMap(historyStore.uploadRecords);
      scene.render();

      return () => {
        if (scene.destroy) scene.destroy();
      };
    }
  }, [dataLoaded]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return (<span>早安 <FontAwesomeIcon icon={faSun} className={'sun-icon'} /></span>);
    }
    if (hour < 18) {
      return (<span>下午好 <FontAwesomeIcon icon={faSun} className={'sun-icon'} /></span>);
    }
    return (<span>晚上好 <FontAwesomeIcon icon={faMoon} className={'moon-icon'} /></span>);
  };

  const greeting = (
      <div>
        {getGreeting()}，尊敬的{userInfo.username}，祝你开心每一天！
      </div>
  );

  const Text = Typography.Text;

  // 如果数据仍在加载，显示加载指示器
  if (isLoading) {
    console.log('Loading...')
    return <Spin spinning={isLoading} className='spin' size={'large'}></Spin>;
  }

  return (

      <PageContainer
          header={{
            title: '首页'
          }}
          content={
            <Row align="middle" justify="start">
              <Col>
                <Avatar size={64} src={userInfo.avatar} />
              </Col>
              <Col flex="auto" style={{ marginLeft: 12 }}>
                <Row justify="space-between">
                  <Col>
                    <div className={'greeting-title'}>{greeting}</div>
                    <div style={{ marginTop: '10px' }}>
                      <Tag icon={<ReconciliationOutlined />} color="magenta" >{userInfo.company_name}</Tag>
                      <Tag icon={<UserOutlined />} color="blue">{userInfo.user_level}</Tag>
                    </div>
                  </Col>
                  <Col>
                    <Row gutter={16}>
                      <Col>
                        <Statistic
                            title={'上传次数'}
                            valueStyle={{ color: '#1890ff' }}
                            prefix={<PushpinTwoTone />}
                            value={historyStore.uploadRecords.length}
                        />
                      </Col>
                      <Col>
                        <Divider type="vertical" style={{ height: '5em' }} />
                      </Col>
                      <Col>
                        <Statistic
                            title={'已上传文件数'}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<PictureTwoTone twoToneColor="#cf1322"/>}
                            value={userInfo.upload_count}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          }
      >
      {/* 第一排卡片，第一个卡片占两个位置 */}
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={16} className={'responsive-col'}>
          <Card bordered={false} className="firstRowCard">
                <div style={{ height: "58vh", minHeight: '550px', justifyContent: "center", position: "relative" }} id="homeMap" />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} className={'responsive-col'} >
            <HomeRoadCard />
        </Col>
      </Row>
        <Row gutter={16} style={{ display: 'flex', alignItems: 'stretch' }}>
          {/* 项目进度卡片 */}
          <Col xs={24} sm={24} md={24} lg={16} className={'responsive-col'}>
            <HomeBulletGraph />
          </Col>
          {/* 常用服务和通知卡片 */}
          <Col xs={24} sm={24} md={24} lg={8} className={'responsive-col'}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* 常用服务卡片 */}
              <Card title="常用服务" bordered={false} style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}> {/* 设置水平和垂直间距 */}
                  {services.map((service, index) => (
                      <Col key={index} xs={24} sm={12}> {/* 设置不同屏幕尺寸下占据的列数 */}
                        <Link to={service.link}>
                          <Button type="link">
                            <service.icon className="service-icon" />
                            <Text>{service.name}</Text>
                          </Button>
                        </Link>
                      </Col>
                  ))}
                </Row>
              </Card>

              {/* 通知卡片 */}
              <Card title="通知" bordered={false} style={{ flex: 1 }}>
                <List
                    size="small"
                    dataSource={[]}
                />
              </Card>
            </div>
          </Col>
        </Row>
    </PageContainer>
  )
});


export default Home