import {action, makeAutoObservable, observable} from 'mobx';
import axiosInstance from "../utils/AxiosInstance";
import chatStore from "./ChatStore";
import {classification_mapping} from "../utils/utils";

class ImageStore {
    images = [];
    uploadHint = {
        status: '',
        message: '',
        isProcessing: false,
    };
    lastUploadId = [];
    selectedUploadId = [];
    resultData = [];
    isLastUploadIdFetched = false;
    reportIds = [];
    reportData = [];
    analysisResult = [];
    cameFromReport = false;

    constructor() {
        makeAutoObservable(this, {
            images: observable,
            uploadHint: observable,
            lastUploadId: observable,
            selectedUploadId: observable,
            resultData: observable,
            isLastUploadIdFetched: observable,
            reportIds: observable,
            reportData: observable,
            analysisResult: observable,
            addImage: action,
            setResultData: action,
            setReportIds: action,
            setReportData: action,
            setAnalysisResult: action,
            setUploadHint: action,
            setSelectedUploadId: action,
            uploadImages: action,
            setLastUploadId: action,
            resetIsLastUploadIdFetched: action,
            fetchLastUploadId: action,
            fetchResultData: action,
        });
    }

    addImage(imageData) {
        this.images.push(imageData);
    }

    setResultData(results) {
        this.resultData = results;
    }

    setReportIds(ids) {
        this.reportIds = ids;
    }

    setReportData(data) {
        this.reportData = data;
    }

    setAnalysisResult(data) {
        this.analysisResult = data;
    }

    setUploadHint(uploadHint) {
        this.uploadHint = {
            ...this.uploadHint,
            ...uploadHint,
        };
    }

    setSelectedUploadId(ids) {
        this.selectedUploadId = [];
        this.selectedUploadId = ids;
    }

    setCameFromReport(value) {
        this.cameFromReport = value;
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

        // // 日志记录，用于调试
        // for (let [key, value] of formData.entries()) {
        //     console.log(key + ':', value);
        //     if (value instanceof File) {
        //         console.log('File Name:', value.name);
        //         console.log('File Size:', value.size);
        //         console.log('File Type:', value.type);
        //     }
        // }

        try {
            this.setUploadHint({
                status: 'processing',
                message: '正在处理图片，请稍后...',
                isProcessing: true,
            })
            const response = await axiosInstance.post('/irdip/upload/', formData);
            const responseData = response.data;

            this.setUploadHint({
                status: 'success',
                message: '上传成功！',
                isProcessing: false,
            })
            this.setSelectedUploadId([]);
            return responseData;
        } catch (error) {
            this.setUploadHint({
                status: 'error',
                message: '上传失败，请稍后再试！',
                isProcessing: false,
            })
            console.error('Error during image upload:', error);
        } finally {
            this.setUploadHint({
                isProcessing: false,
            })
        }
    }

    async uploadCompressed(fileList, imageInfo) {
        const formData = new FormData();

        // 将压缩文件添加到 FormData
        formData.append('compressed_file', fileList[0].originFileObj);

        // 添加其他表单数据到 FormData
        for (const key in imageInfo) {
            formData.append(key, imageInfo[key]);
        }

        try {
            this.setUploadHint({
                status: 'processing',
                message: '正在处理图片，请稍后...',
                isProcessing: true,
            })
            const response = await axiosInstance.post('/irdip/upload_compressed/', formData);
            const responseData = response.data;

            this.setUploadHint({
                status: 'success',
                message: '上传成功！',
                isProcessing: false,
            })
            this.setSelectedUploadId([]);
            return responseData;
        } catch (error) {
            this.setUploadHint({
                status: 'error',
                message: '上传失败，请稍后再试！',
                isProcessing: false,
            })
            console.error('Error during image upload:', error);
        } finally {
            this.setUploadHint({
                isProcessing: false,
            })
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
                throw error; // 抛出错误
            });
    }

    fetchResultData(ids) {
        const params = new URLSearchParams();
        ids.forEach(id => params.append('upload_id', id));

        // 返回 axios 请求的 Promise
        return axiosInstance.get('/irdip/get_result/', { params })
            .then(response => {
                console.log(response.data);
                this.setResultData(response.data);
                this.setAnalysisResult(calculatePercentage(this.resultData));
                // 确保 ChatStore 使用最新的 analysisResult
                chatStore.setMessages([]);
                chatStore.updateAnalysisResult(this.analysisResult);
            })
            .catch(error => {
                console.error('Error fetching upload data: ', error);
                // 可以选择在这里处理错误，或者把它抛出让调用者处理
                // throw error;
            });
    }



}


const calculatePercentage = (data) => {
    const percentage = [];

    // 对每个 upload 计算分类的占比
    Object.entries(data).forEach(([uploadId, entry]) => {
        const { road_name, upload_name, files } = entry;
        const typeName = `${road_name}-${upload_name}`;
        const totalCount = files.length;
        const counts = {};

        // 初始化分类计数
        Object.keys(classification_mapping).forEach(classification => {
            counts[classification] = 0;
        });

        // 计算每个分类的数量
        files.forEach(file => {
            counts[file.classification_result]++;
        });

        // 转换为占比并添加描述性名称
        Object.entries(counts).forEach(([classification, count]) => {
            percentage.push({
                typeName, // 使用描述性名称
                classification: classification_mapping[classification], // 使用分类的描述
                percentage: count / totalCount
            });
        });
    });

    return percentage;
};


const imageStore = new ImageStore();
export default imageStore;

