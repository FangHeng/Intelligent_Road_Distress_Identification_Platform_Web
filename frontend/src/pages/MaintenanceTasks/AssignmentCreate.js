// AssignmentCreate.js: 创建维修任务页面
import {PageContainer} from "@ant-design/pro-components";
import TaskStepForm from "./TaskStepForm";
import React from "react";

const AssignmentCreate = () => {
    return (
        <PageContainer
            header={{
                title: "创建维修任务",
            }}
        >
            <TaskStepForm task={{}}/>

        </PageContainer>
    );
}

export default AssignmentCreate;

