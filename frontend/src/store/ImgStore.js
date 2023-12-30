import { makeAutoObservable } from 'mobx';
import axiosInstance from "../utils/AxiosInstance";
import {processStackedData} from "../components/Graph/ClassStackedBarChart";
import { message } from 'antd';
import chatStore from "./ChatStore";

class ImageStore {
    images = [];
    uploadHint = {
        status: '',  // 'success', 'error', or ''
        message: '',
        isProcessing: false,
    };
    lastUploadId = [];
    selectedUploadId = [];
    resultData = [];
    isLastUploadIdFetched = false;
    reportData = [];
    analysisResult = [];

    constructor() {
        makeAutoObservable(this);
    }

    addImage(imageData) {
        this.images.push(imageData);
    }

    async uploadImages(fileList, imageInfo) {
        const formData = new FormData();

        fileList.forEach(file => {
            formData.append('files', file.originFileObj);
        });

        // 添加其他表单数据到 FormData
        for (const key in imageInfo) {
            formData.append(key, imageInfo[key]);
        }

        // 日志记录，用于调试
        for (let [key, value] of formData.entries()) {
            console.log(key + ':', value);
            if (value instanceof File) {
                console.log('File Name:', value.name);
                console.log('File Size:', value.size);
                console.log('File Type:', value.type);
            }
        }

        try {
            this.uploadHint.isProcessing = true;
            const response = await axiosInstance.post('/irdip/upload/', formData);
            const responseData = response.data;

            this.uploadHint.status = 'success';
            this.uploadHint.message = '处理成功！';
            this.uploadHint.isProcessing = false;
            this.selectedUploadId = [];
            return responseData;
        } catch (error) {
            this.uploadHint.status = 'error';
            this.uploadHint.message = '图片处理失败！';
            console.error('Error during image upload:', error);
        } finally {
            this.uploadHint.isProcessing = false;
        }
    }

    setLastUploadId(id) {
        this.lastUploadId = [];
        this.lastUploadId.push(id);
        this.isLastUploadIdFetched = true;
    }

    resetIsLastUploadIdFetched() {
        this.isLastUploadIdFetched = false;
    }

    async fetchLastUploadId() {
        return axiosInstance.get('/irdip/get_lasted_upload_id/')
            .then(response => {
                const uploadId = response.data.upload_id;
                if (uploadId) {
                    this.setLastUploadId(uploadId);
                    console.log('Last upload id:', uploadId);
                }
                return uploadId; // 返回 uploadId，以便在 Promise 解决时使用
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
                throw error; // 抛出错误，以便在调用链上捕获
            });
    }

    // fetchResultData(ids) {
    //     const params = new URLSearchParams();
    //     ids.forEach(id => params.append('upload_id', id));
    //
    //     axiosInstance.get('/irdip/get_result', { params })
    //         .then(response => {
    //             console.log(response.data);
    //             this.resultData = response.data;
    //         })
    //         .catch(error => {
    //             console.error('Error fetching upload data: ', error);
    //         });
    // }
    fetchResultData(ids) {
        const params = new URLSearchParams();
        ids.forEach(id => params.append('upload_id', id));

        // 返回 axios 请求的 Promise
        return axiosInstance.get('/irdip/get_result/', { params })
            .then(response => {
                console.log(response.data);
                this.resultData = response.data;
                this.analysisResult = processStackedData(this.resultData);
                // 确保 ChatStore 使用最新的 analysisResult
                chatStore.updateAnalysisResult(this.analysisResult);
            })
            .catch(error => {
                console.error('Error fetching upload data: ', error);
                message.error('获取数据失败!');
                // 可以选择在这里处理错误，或者把它抛出让调用者处理
                // throw error;
            });
    }

    setReportData(data) {
        this.reportData = data;
    }



}


const imageStore = new ImageStore();
export default imageStore;

