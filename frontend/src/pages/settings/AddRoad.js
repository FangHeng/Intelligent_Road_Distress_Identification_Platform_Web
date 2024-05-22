// AddRoad.js: 添加路段信息
import {App, Button, Tabs, Form} from "antd";
import React, {useState} from "react";
import {observer} from "mobx-react-lite";
import { QuestionCircleOutlined,} from "@ant-design/icons";
import RoadRegister from "../../components/Road/RoadRegiter";
import HistoryRoad from "../../components/Road/HistoryRoad";
import {
    ModalForm,
    PageContainer,
    ProForm,
    ProFormCascader,
    ProFormText,
} from "@ant-design/pro-components";
import provinceOptions from "../../utils/roadData";

const AddRoad = observer(() => {
    const [modalVisit, setModalVisit] = useState(false);
    const {message} = App.useApp();
    const [form] = Form.useForm();

    const items = [
        {
            key: '1',
            label: `添加新路段`,
            children: <RoadRegister/>,

        },
        {
            key: '2',
            label: `已添加路段`,
            children: <HistoryRoad/>,
        },
    ]

    const operations =
        <Button
            type="link"
            onClick={() => {
                setModalVisit(true);
            }}
        >
            <QuestionCircleOutlined />
            未找到你的道路？
        </Button>

    return (
        <App>
        <PageContainer
            header={{
                title: '添加道路',
            }}
        >
            <Tabs defaultActiveKey="1" items={items} tabBarExtraContent={operations} destroyInactiveTabPane={true}/>
            <ModalForm
                title="新建表单"
                open={modalVisit}
                form={form}
                onFinish={async (values) => {
                    message.success('提交成功！');
                    // 打印表单的输入值
                    console.log(values);
                    return true;
                }}
                onOpenChange={setModalVisit}
            >
                <ProForm.Group>
                    <ProFormCascader
                        label="请选择省市区："
                        required={true}
                        name="area"
                        fieldProps={{
                            options: provinceOptions,
                        }}
                        width="md">
                    </ProFormCascader>
                    <ProFormText
                        width="md"
                        name="roadName"
                        label="请输入道路名："
                        placeholder="请输入名称"
                        required={true}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="longitude"
                        label="经度"
                        placeholder="输入经度"
                        required={true}
                    />
                    <ProFormText
                        width="md"
                        name="latitude"
                        label="纬度"
                        placeholder="输入纬度"
                        required={true}
                    />
                </ProForm.Group>
            </ModalForm>
        </PageContainer>
</App>
    )
});


export default AddRoad