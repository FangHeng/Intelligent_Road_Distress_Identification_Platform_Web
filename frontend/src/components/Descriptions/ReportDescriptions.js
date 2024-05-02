import {ProDescriptions} from "@ant-design/pro-components";
import imgStore from "../../store/ImgStore";
import {Progress} from "antd";
import React from "react";
import {observer} from "mobx-react-lite";

const ReportDescriptions = observer(({ report, tags }) => {
    console.log(report)
    console.log(tags)
    const handleSave = async (keypath, newInfo, oriInfo) => {
        // 找到需要更新的数据项
        const dataIndex = imgStore.reportData.findIndex(item => item.theme === keypath);

        if (dataIndex !== -1) {
            // 创建数据的副本
            const updatedData = [...imgStore.reportData];
            updatedData[dataIndex] = { ...updatedData[dataIndex], answer: newInfo[keypath] };

            // 更新 reportData 状态
            imgStore.setReportData(updatedData);
            console.log(imgStore.reportData)

            // // 创建 pdfData 副本并更新
            // const newPdfData = [updatedData[0], ...updatedData.slice(1).filter(item => selectedTags.includes(item.theme))];
            // // setPdfData(newPdfData);
        }
    };

    return (
        <ProDescriptions
            title={report[0].theme} // 使用第一个字典的 theme 作为标题
            dataSource={report[0]} // 只使用第一个字典作为数据源
            tooltip={`道路 ${report[0].road_name} 的报告`}
            column={2}
            //actionRef={actionRef}
            // bordered
            formProps={{

            }}
            editable={{
                onSave: async (keypath, newInfo, oriInfo) => {
                    await handleSave(keypath, newInfo, oriInfo);
                }
            }} // 使内容可编辑
            columns={[
                {
                    title: '上传者',
                    dataIndex: 'uploader',
                    key: 'uploader',
                    editable: false,
                },
                {
                    title: '上传时间',
                    dataIndex: 'upload_time',
                    key: 'upload_time',
                    valueType: 'dateTime',
                    editable: false,
                },
                {
                    title: '位置',
                    key: 'location',
                    render: (_, record) => (
                        <>{record.province} {record.city} {record.district}</>
                    ),
                    editable: false,
                },
                {
                    title: 'GPS坐标',
                    key: 'gps',
                    render: (_, record) => (
                        <>{record.gps_longitude}, {record.gps_latitude}</>
                    ),
                    editable: false,
                },
                {
                    title: '道路名称',
                    dataIndex: 'road_name',
                    key: 'road_name',
                    editable: false,
                },
                {
                    title: '上传数量',
                    dataIndex: 'upload_count',
                    key: 'upload_count',
                    editable: false,
                },
                {
                    title: '选择的模型',
                    dataIndex: 'selected_model',
                    key: 'selected_model',
                    editable: false,
                },
                {
                    title: '完好程度',
                    key: 'integrity',
                    render: (_, record) => (
                        <Progress
                            percent={100 - record.damage_ratio * 100}
                            format={percent => `${percent.toFixed(2)}%`}
                        />
                    ),
                    editable: false,
                }
            ]}
        >
            {/*<ProDescriptions.Item label="导出报告" valueType="option">*/}
            {/*</ProDescriptions.Item>*/}
            {
                imgStore.reportData.slice(1).map((item, index) => {
                    if (tags.includes(item.theme)) {
                        return (
                            <ProDescriptions.Item
                                label={item.theme}
                                dataIndex={item.theme}
                                key={item.theme}
                                span={2}
                                copyable // 使内容可复制
                                valueType={'textarea'}
                                className='custom-editor'
                            >
                                {item.answer}
                            </ProDescriptions.Item>
                        );
                    }
                })
            }
        </ProDescriptions>
        )

})

export default ReportDescriptions;