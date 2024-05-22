// Assignments.js: 任务管理页面，展示任务列表，点击查看按钮可以查看任务详情
import React, {useEffect, useRef, useState} from 'react';
import { PageContainer } from "@ant-design/pro-components";
import { ProList } from '@ant-design/pro-components';
import {Button, Modal, Progress, Space, Tag, Typography} from 'antd';
import TaskStatisticCard from "../../components/Card/TaskStatisticCard";
import TaskStepForm from "../../components/Forms/TaskStepForm";
import taskStore from "../../store/TaskStore";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";

const { Text } = Typography;

const Assignments = observer(() => {
    // const [tasks, setTasks] = useState(taskStore.tasks);
    // const [currentTask, ] = useState(taskStore.currentTask);
    const [isModalVisible, setIsModalVisible] = useState(false);
    // const [currentTask, setCurrentTask] = useState(null);
    //
    // const [taskData, setTaskData] = useState({}) // 父组件中的状态定义，单个任务的数据
    const navigate = useNavigate();
    const showModal = (task) => {
        taskStore.setCurrentTask(task.taskId);
        taskStore.setTaskData(task.taskId);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        // taskStore.setCurrentTask(null);
        taskStore.resetTask();
        handleRefresh();
    };
    // 控制proList的刷新
    const actionRef = useRef();

    // const [updateKey, setUpdateKey] = useState(0); // 添加一个用于强制更新的状态

    // useEffect(() => {
    //     console.log('监听任务列表变化');
    //     if (actionRef.current) {
    //         actionRef.current?.reload();
    //     } else {
    //         // 如果 actionRef.current 不存在，则尝试强制更新组件
    //         setUpdateKey(prevKey => prevKey + 1);
    //     }
    //     console.log('任务列表变化了');
    // }, [taskStore.tasks]); // 侦听taskStore.tasks的变化
    //
    // useEffect(() => {
    //     console.log('....')
    // }, [taskStore.tasks]);

    // 当你需要基于某个事件刷新列表时
    const handleRefresh = () => {
        actionRef.current?.reload();
    };

    return (
        <PageContainer header={{ title: '任务管理' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
            <TaskStatisticCard />
            <ProList
                toolBarRender={() => [
                    <Button key="newTask" type="link" onClick={()=>{
                        navigate('/pages/MaintenanceTasks/AssignmentsCreate')
                    }}>
                        新建任务
                    </Button>,
                    <Button key="refresh" type="link" onClick={handleRefresh}>
                        刷新
                    </Button>
                ]}
                search={{
                    filterType: 'light',
                }}
                actionRef={actionRef}
                loading={taskStore.tasks.length === 0}
                request={async (params, sorter, filter) => {
                    return new Promise((resolve) => {
                        const filteredTasks = taskStore.tasks.filter(task => {
                            // 对于taskName，如果params中包含taskName，则比较任务名称；否则默认通过
                            const taskNameMatch = params.taskName ? task.taskName.includes(params.taskName) : true;
                            // 对于status，如果params中包含status，则比较状态；否则默认通过
                            const statusMatch = params.status ? task.status === params.status : true;
                            // 对于roadName，如果params中包含roadName，则比较道路名称；否则默认通过
                            const roadNameMatch = params.roadName ? task.roadName === params.roadName : true;
                            // 一个任务必须同时满足所有存在的筛选条件
                            return taskNameMatch && statusMatch && roadNameMatch;
                        });

                        resolve({
                            data: filteredTasks, // 返回过滤后的任务列表
                            success: true,
                        });
                    });
                }}
                rowKey="taskId"
                headerTitle="任务列表"
                // dataSource={taskStore.tasks}
                // defaultData={taskStore.tasks}
                pagination={{ pageSize: 5 }}
                metas={{
                    title: {
                        dataIndex: 'taskName',
                        title: '任务名称',
                        // search: true,
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
                            <div>
                                <Text type={'secondary'}>道路: {record.roadName}</Text>
                                {/*换行*/}
                                <br/>
                                <Text ellipsis={{
                                    tooltip: record.remarks,
                                }}  type={'secondary'}>任务备注: {record.remarks}</Text>
                            </div>
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
                            <Progress percent={record.progress} status={record.status === 'closed' ? 'success' : 'active'} />
                        ),
                        search: false,
                    },
                    status: {
                        // 自己扩展的字段，主要用于筛选，不在列表中显示
                        title: '状态',
                        valueType: 'select',
                        valueEnum: {
                            // all: { text: '全部', status: 'Default' },
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
                    roadName: {
                        title: '道路名称',
                        dataIndex: 'roadName',
                        valueType: 'select',
                        valueEnum: {
                            // all: { text: '全部', value: 'all' }, // 确保“全部”选项也有一个显式的value
                            ...Array.from(new Set(taskStore.tasks.map(task => task.roadName)))
                                .reduce((obj, roadName) => {
                                    obj[roadName] = { text: roadName, value: roadName }; // 设置value和text相同
                                    return obj;
                                }, {}),
                        },
                        hideInTable: true,
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
                {taskStore.currentTask && (
                    <TaskStepForm key={taskStore.currentTask.taskId} handleRefresh={handleRefresh}/>
                )}
            </Modal>
        </PageContainer>
    );
});


export default Assignments;
