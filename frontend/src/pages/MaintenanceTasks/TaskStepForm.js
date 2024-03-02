// TaskStepForm.js: 任务步骤表单，包括创建任务，更新进度，完成任务等步骤。
import React, {useEffect, useState} from 'react';
import {Button, Result, Space, Steps, Typography, App} from 'antd';
import {
    ProCard, ProDescriptions,
    ProForm,
    ProFormDateRangePicker, ProFormSelect,
    ProFormSlider,
    ProFormText,
    ProFormTextArea
} from "@ant-design/pro-components";
import roadStore from "../../store/RoadStore";
import {observer} from "mobx-react-lite";
import {ArrowLeftOutlined, ArrowRightOutlined} from "@ant-design/icons";
import taskStore from "../../store/TaskStore";

const {Title} = Typography;

const TaskStepForm = observer(({task}) => {
    const roadData = roadStore.roadData;
    const {message} = App.useApp();
    const [current, setCurrent] = useState(0);
    const roadOptions = roadData.map(road => ({
        label: road.road_name, // 显示给用户的名称
        value: road.road_id, // 实际的道路ID
    }));

    const [taskData, setTaskData] = useState(task);

    useEffect(() => {
        switch (taskData.status) {
            case 'closed':
                setCurrent(2);
                break;
            case 'processing':
                setCurrent(1);
                break;
            default:
                setCurrent(0);
        }
    }, [taskData.status]); // 当taskData.status变化时更新步骤

    const onCreateTaskFinish = async (values) => {
        console.log(values);
        //等待2秒模拟后端响应
        await new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
        setTaskData({...taskData, ...values, status: 'processing'}); // 更新任务状态
        message.success('创建任务成功！');
        setCurrent(current + 1);
    };

    const updateTaskProgress = (newProgress) => {
        setTaskData((currentTasks) => {
            return {
                ...currentTasks,
                progress: newProgress,
            };
        });
    };

    const steps = [
        {
            title: '创建任务',
            description: '这里填写任务的基本信息',
            content:
                <ProCard
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '24px', // 可以调整padding确保内容不会贴边
                    }}
                    bordered
                >
                    <ProForm
                        style={{
                            maxWidth: '60vw', // 限制表单的最大宽度
                            width: '100%', // 确保在限制范围内表单宽度是100%
                        }}
                        onFinish={onCreateTaskFinish}
                        layout="vertical" // 使用水平布局
                        grid={true} // 启用栅格布局
                        name='basic-form'
                        submitter={{
                            render: (props, doms) => {
                                return [
                                    <Button
                                        type="default"
                                        key="rest"
                                        onClick={() => props.form?.resetFields()}
                                    >
                                        重置
                                    </Button>,
                                    <Button
                                        type="primary"
                                        key="submit"
                                        onClick={() => {
                                            props.form?.submit?.()

                                        }
                                        }
                                    >
                                        提交
                                    </Button>,
                                ];
                            },
                            resetButtonProps: {
                                style: {
                                    // 隐藏重置按钮
                                    display: 'none',
                                },
                            },

                        }}
                    >
                        <ProFormText
                            name="taskName"
                            label="任务名称"
                            colProps={{md: 18, xl: 12}}
                            rules={[{required: true, message: '请输入任务名称'}]}
                            tooltip="用于标定的该任务的名称"
                        />
                        <ProFormSelect
                            name="roadId"
                            label="道路"
                            showSearch
                            options={roadOptions}
                            colProps={{md: 16, xl: 12}}
                            rules={[{required: true, message: '请选择道路'}]}
                            fieldProps={{
                                filterOption: (input, option) =>
                                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                            }}
                        />
                        <ProFormSelect
                            name="responsibleName"
                            label="项目负责人"
                            colProps={{md: 16, xl: 12}}
                            valueEnum={{
                                // red: 'Red',
                                // green: 'Green',
                                // blue: 'Blue',
                                WangXiaoEr: '王小二',
                                LiSi: '李四',
                                ZhangSan: '张三',
                            }}
                            fieldProps={{
                                mode: 'multiple',
                            }}
                            placeholder="请选择项目负责人"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择项目负责人',
                                    type: 'array',
                                },
                            ]}
                        />

                        <ProFormDateRangePicker
                            name="estimatedEndDate"
                            label="项目持续时间"
                            colProps={{md: 16, xl: 12}}
                            rules={[{required: true, message: '请选择项目持续时间！'}]}
                        />
                        <ProFormTextArea
                            name="remarks"
                            colProps={{md: 24}}
                            label="任务备注"
                        />
                    </ProForm>
                </ProCard>
        },
        {
            title: '更新进度',
            description: '这里更新任务的进度和预计完成日期',
            content:

                <ProCard
                    bordered
                >
                    <ProForm
                        onFinish={async (values) => {
                            console.log(values);
                            // Proceed to next step or save data
                        }}
                        layout="vertical" // 使用水平布局
                        grid={true} // 启用栅格布局
                        name='update-form'
                        submitter={{
                            render: (props, doms) => {
                                return [
                                    <Button
                                        type="default"
                                        key="prev"
                                        onClick={() => prev()}
                                    ><ArrowLeftOutlined />
                                        前一步
                                    </Button>,
                                    <Button
                                        type="primary"
                                        key="update"
                                        onClick={() => {
                                            console.log(taskData);
                                        }
                                        }
                                    >
                                        更新进度
                                    </Button>,
                                    <Button
                                        type="primary"
                                        key="complete"
                                        disabled={taskData.progress !== 100}
                                        onClick={() => {
                                            if (taskData.progress === 100) {
                                                setCurrent(current + 1);
                                            } else {
                                                message.error('任务的进度还不是100%，不能确认！');
                                            }
                                        }}
                                    >
                                        完成
                                        <ArrowRightOutlined />
                                    </Button>,
                                ];
                            },
                            resetButtonProps: {
                                style: {
                                    // 隐藏重置按钮
                                    display: 'none',
                                },
                            },
                            submitButtonProps: {
                                style: {
                                    // 隐藏提交按钮
                                    display: 'none',
                                }
                            }
                        }}
                    >
                        <Title level={5}>项目进度</Title>
                        <ProFormSlider
                            name="progress"
                            marks={{
                                0: '0%',
                                20: '20%',
                                40: '40%',
                                60: '60%',
                                80: '80%',
                                100: '100%',
                            }}
                            fieldProps={{
                                onChange: (value) => {
                                    updateTaskProgress(value);
                                    taskStore.updateTaskProgress(taskData.taskId, value);
                                },
                            }}
                            initialValue={taskData.progress}
                        />
                        <ProDescriptions
                            column={2} // 设置列数
                            title={task.taskName} // 可以设置ProDescriptions的标题为任务名称
                            dataSource={task} // 传入数据源
                            editable
                        >
                            <ProDescriptions.Item label="任务ID" dataIndex="taskId" editable={false}/>
                            <ProDescriptions.Item label="创建者" dataIndex="creatorName" editable={false}/>
                            <ProDescriptions.Item
                                label="负责人"
                                dataIndex="responsibleName"
                                editable={false}
                                // 使用render方法来自定义内容的展示
                                render={(text, record) => {
                                    // 将responsibleName数组转换为用逗号和空格分隔的字符串
                                    // 注意: 确保responsibleName不是undefined或null
                                    const namesString = record.responsibleName?.join(', ');
                                    return <span>{namesString}</span>;
                                }}
                            />
                            <ProDescriptions.Item label="道路" dataIndex="roadName" editable={false}/>
                            <ProDescriptions.Item label="分析报告" dataIndex="analysisReport" editable={false}>
                                <a href={task.analysisReport} target="_blank" rel="noopener noreferrer">查看报告</a>
                            </ProDescriptions.Item>
                            {/*<ProDescriptions.Item label="任务进度" dataIndex="progress" editable={false}/>*/}
                            <ProDescriptions.Item label="创建日期" dataIndex="createdAt" editable={false}
                                                  valueType={"date"}/>
                            <ProDescriptions.Item label="预计结束日期" dataIndex="estimatedEndDate" valueType={"date"}/>
                            <ProDescriptions.Item label="任务备注" dataIndex="remarks" editable={false} valueType="text"
                                                  contentStyle={{
                                                      maxWidth: '80%',
                                                  }}
                                                  renderText={(_) => {
                                                      return _ + _;
                                                  }}
                                                  ellipsis/>
                        </ProDescriptions>
                    </ProForm>
                </ProCard>
        },
        {
            title: '完成',
            description: '任务已完成！',
            content:
                <Result
                    status="success"
                    title="该任务已完成！"
                    subTitle="任务已经完成，您可以查看任务的最终状态。"
                    extra={[
                        <Button type="primary" key="return">
                            返回任务列表
                        </Button>,
                        <Button key="recreate">再次创建任务</Button>,
                    ]}

                >
                    <ProDescriptions
                        column={2} // 设置列数
                        title={task.taskName} // 可以设置ProDescriptions的标题为任务名称
                        dataSource={task} // 传入数据源
                    >
                        <ProDescriptions.Item label="任务ID" dataIndex="taskId"/>
                        <ProDescriptions.Item label="创建者" dataIndex="creatorName"/>
                        <ProDescriptions.Item
                            label="负责人"
                            dataIndex="responsibleName"
                            // 使用render方法来自定义内容的展示
                            render={(text, record) => {
                                // 将responsibleName数组转换为用逗号和空格分隔的字符串
                                // 注意: 确保responsibleName不是undefined或null
                                const namesString = record.responsibleName?.join(', ');
                                return <span>{namesString}</span>;
                            }}
                        />
                        <ProDescriptions.Item label="道路" dataIndex="roadName"/>
                        <ProDescriptions.Item label="分析报告" dataIndex="analysisReport">
                            <a href={task.analysisReport} target="_blank" rel="noopener noreferrer">查看报告</a>
                        </ProDescriptions.Item>
                        {/*<ProDescriptions.Item label="任务进度" dataIndex="progress" editable={false}/>*/}
                        <ProDescriptions.Item label="创建日期" dataIndex="createdAt"
                                              valueType={"date"}/>
                        <ProDescriptions.Item label="预计结束日期" dataIndex="estimatedEndDate" valueType={"date"}/>
                        <ProDescriptions.Item label="任务备注" dataIndex="remarks" valueType="text"
                                              contentStyle={{
                                                  maxWidth: '80%',
                                              }}
                                              renderText={(_) => {
                                                  return _ + _;
                                              }}
                                              ellipsis/>
                    </ProDescriptions>
                </Result>
        },
    ];

    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };
    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
        description: item.description,
    }));

    return (
        <ProCard style={{paddingLeft: '5vw', paddingRight: '5vw'}}>
            <Space direction="vertical" style={{width: '100%'}}>
                <Steps current={current} items={items}/>
                <div>
                    {steps[current].content}
                </div>
                {/*<div*/}
                {/*    style={{*/}
                {/*        marginTop: 24,*/}
                {/*    }}*/}
                {/*>*/}
                {/*    {current < steps.length - 1 && (*/}
                {/*        <Button type="primary" onClick={() => next()}>*/}
                {/*            Next*/}
                {/*        </Button>*/}
                {/*    )}*/}
                {/*    {current === steps.length - 1 && (*/}
                {/*        <Button type="primary" onClick={() => message.success('Processing complete!')}>*/}
                {/*            Done*/}
                {/*        </Button>*/}
                {/*    )}*/}
                {/*    {current > 0 && (*/}
                {/*        <Button*/}
                {/*            style={{*/}
                {/*                margin: '0 8px',*/}
                {/*            }}*/}
                {/*            onClick={() => prev()}*/}
                {/*        >*/}
                {/*            Previous*/}
                {/*        </Button>*/}
                {/*    )}*/}
                {/*</div>*/}
            </Space>
        </ProCard>
    );
});
export default TaskStepForm;