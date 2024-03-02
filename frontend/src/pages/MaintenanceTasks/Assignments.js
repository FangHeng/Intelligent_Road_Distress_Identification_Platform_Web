// Assignments.js: 任务管理页面，展示任务列表，点击查看按钮可以查看任务详情
import React, {useState} from 'react';
import { PageContainer } from "@ant-design/pro-components";
import { ProList } from '@ant-design/pro-components';
import {Button, Modal, Progress, Space, Tag} from 'antd';
import TaskStatisticCard from "./TaskStatisticCard";
import TaskStepForm from "./TaskStepForm";
import taskStore from "../../store/TaskStore";
import {observer} from "mobx-react-lite";

const Assignments = observer(() => {
    const tasks = taskStore.tasks;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);

    const showModal = (task) => {
        setCurrentTask(task);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setCurrentTask(null);
    };

    return (
        <PageContainer header={{ title: '任务管理' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
            <TaskStatisticCard />
            <ProList
                toolBarRender={() => [
                    <Button key="3" type="link">
                        新建任务
                    </Button>,
                ]}
                search={{ filterType: 'light' }}
                rowKey="taskId"
                headerTitle="任务列表"
                dataSource={tasks}
                pagination={{ pageSize: 5 }}
                metas={{
                    title: {
                        dataIndex: 'taskName',
                        title: '任务名称',
                    },
                    subTitle: {
                        render: (text, record) => (
                            <Space>
                                <Tag color="blue">创建者: {record.creatorName}</Tag>
                                {/* 将数组转换为以逗号和空格分隔的字符串 */}
                                <Tag color="green">负责人: {record.responsibleName.join(', ')}</Tag>
                            </Space>
                        ),
                        search: false,
                    },
                    description: {
                        render: (text, record) => (
                            <>
                                <div>道路: {record.roadName}</div>
                                <div>任务备注: {record.remarks}</div>
                            </>
                        ),
                        search: false,
                    },
                    actions: {
                        render: (text, record) => [
                            <Button key={record.taskId} onClick={() => showModal(record)} type={'link'}>
                                查看
                            </Button>
                        ],
                        search: false,
                    },
                    content: {
                        render: (text, record) => (
                        //     通过Progress组件展示任务进度，100%时显示已完成
                            <Progress percent={record.progress} status={record.progress === 100 ? 'success' : 'active'} />
                        ),
                        search: false,
                    },
                    status: {
                        // 自己扩展的字段，主要用于筛选，不在列表中显示
                        title: '状态',
                        valueType: 'select',
                        valueEnum: {
                            all: { text: '全部', status: 'Default' },
                            closed: {
                                text: '已完成',
                                status: 'closed',
                            },
                            processing: {
                                text: '正在进行中',
                                status: 'processing',
                            },
                        },
                    },
                }}
            />
            </Space>
            <Modal
                title="任务详情"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null} // 不显示默认的底部按钮
                width={1000}
                >
                {currentTask && <TaskStepForm task={currentTask} key={currentTask.taskId}/>}
            </Modal>
        </PageContainer>
    );
});


export default Assignments;
