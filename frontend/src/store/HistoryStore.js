import {makeObservable} from "mobx";
import axiosInstance from "../utils/AxiosInstance";
import {message} from "antd";

class HistoryStore {
    cameFromDetect = false;
    navigateRef = null;
    uploadRecords = [];
    isLoading = false;

    setNavigate(navigateRef) {
        this.navigateRef = navigateRef;
    }

    // 从后端获取数据的方法
    constructor() {
        makeObservable(this);
    }

    fetchUploadRecords() {
        this.isLoading = true; // 设置加载标志
        // 返回一个 Promise 对象
        return axiosInstance.get('/irdip/get_upload_records/')
            .then(response => {
                console.log('获取历史数据成功:', response.data);
                this.uploadRecords = response.data;
                this.isLoading = false; // 设置加载标志
                return response.data; // 返回获取的数据
            })
            .catch(error => {
                message.error('获取历史数据失败!');
                console.error('Error fetching data:', error);
                this.isLoading = false; // 设置加载标志
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

                    // this.fetchUploadRecords();
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

     countClass6 = (data) => {
        let totalFiles = 0;
        let totalClass6 = 0;

        Object.values(data).forEach(entry => {
            entry.files.forEach(file => {
                totalFiles += 1;
                if (file.classification_result === 6) {
                    totalClass6 += 1;
                }
            });
        });

        return totalFiles > 0 ? totalClass6 / totalFiles : 0;
    };


}

const historyStore = new HistoryStore();

export default historyStore;
