// AssignmentCreate.js: 创建维修任务页面
import {PageContainer} from "@ant-design/pro-components";
import TaskStepForm from "../../components/Forms/TaskStepForm";
import React from "react";

const AssignmentCreate = () => {

    return (
        <PageContainer
            header={{
                title: "创建维修任务",
            }}
            content={
                "根据检测结果提供的报告，创建维修任务，并更新任务的实际进度。"
            }
        >
            <TaskStepForm />
        </PageContainer>
    );

}

export default AssignmentCreate;

