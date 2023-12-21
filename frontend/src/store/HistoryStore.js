import {makeObservable} from "mobx";
import axiosInstance from "../utils/AxiosInstance";
import {message, Progress, Space, Tag} from 'antd'
import listIcon from "../assets/icons/list.svg";

class HistoryStore {
    uploadRecords = []; // 用于存储上传记录的数组

    // 从后端获取数据的方法
    constructor() {
        makeObservable(this);
    }

    fetchUploadRecords() {
        return axiosInstance.get('/irdip/get_upload_records')
            .then(response => {
                const data = response.data.map(item => ({
                    id:item.upload_id,
                    title: item.upload_name,
                    road: item.road__road_name,
                    subTitle: <Space ><Tag color="geekblue">{item.road__road_name}</Tag><Tag color="blue">{item.uploader__user__username}</Tag></Space>,
                    actions: [
                        <a key="invite">删除</a>,
                        <a key="operate">查看</a>,
                    ],
                    description: (
                        <div>
                            <div>共上传{item.upload_count}张照片</div>
                            <div>上传时间：{item.upload_time}</div>
                        </div>
                    ),
                    avatar: listIcon,
                    uploader: item.uploader__user__username,
                    content: (
                        <div
                            style={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <div
                                style={{
                                    width: 200,
                                }}
                            >
                                <div style={{marginBottom:'5px'}}>完好程度：</div>
                                <Progress percent={parseFloat(item.Integrity) } />
                            </div>
                        </div>
                    ),
                }));
                return data; // 返回处理后的数据
            })
            .catch(error => {
                message.error('获取历史数据失败!');
                console.error('Error fetching data:', error);
                return []; // 在错误情况下返回空数组
            });
    }

}

const historyStore = new HistoryStore();

export default historyStore;
