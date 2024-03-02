import {action, makeObservable, observable} from "mobx";
import axiosInstance from "../utils/AxiosInstance";

class HistoryStore {
    cameFromDetect = false;
    uploadRecords = [];
    isLoading = true;
    dataLoaded = false;

    constructor() {
        makeObservable(this, {
            uploadRecords: observable,
            isLoading: observable,
            dataLoaded: observable,
            cameFromDetect: observable,
            setIsLoading: action,
            setDataLoaded: action,
            setCameFromDetect: action,
            fetchUploadRecords: action,
            deleteUploadRecord: action,
        });
    }

    setIsLoading(value) {
        this.isLoading = value;
    }

    setDataLoaded(value) {
        this.dataLoaded = value;
    }

    fetchUploadRecords() {
        this.setIsLoading(true);
        // 返回一个 Promise 对象
        return axiosInstance.get('/irdip/get_upload_records/')
            .then(response => {
                console.log('获取历史数据成功:', response.data);
                this.uploadRecords = response.data;
                this.setIsLoading(false);
                this.setDataLoaded(true);

                return response.data; // 返回获取的数据
            })
            .catch(error => {
                // message.error('获取历史数据失败!');
                console.error('Error fetching data:', error);
                this.setIsLoading(false);
                this.setDataLoaded(false);
                return []; // 在错误情况下返回空数组
            });
    }

    setCameFromDetect(value) {
        this.cameFromDetect = value;
    }


    deleteUploadRecord(uploadId) {
        return axiosInstance.delete(`/irdip/delete_upload_record/${uploadId}/`)
            // .then(response => response.data.status === 'success' ? message.success('删除成功！')
            //     : message.error('删除失败！'))
            .then(response => {
                if (response.data.status === 'success') {

                    // 过滤掉被删除的记录
                    // this.uploadRecords = this.uploadRecords.filter(item => item.upload_id !== uploadId);
                    return { success: true, message: response.data.message };
                } else {
                    return { success: false, message: '删除失败！' };
                }
            })
            .catch(error => {
                console.log('删除失败:', error)
                return { success: false, message: '删除失败！' };
                // throw error.response?.data?.message || '删除失败';
            });
    }


}

const historyStore = new HistoryStore();

export default historyStore;
