import { makeAutoObservable } from 'mobx';
import axiosInstance from "../utils/AxiosInstance";

class ImageStore {
    images = [];
    uploadHint = {
        status: '',  // 'success', 'error', or ''
        message: '',
        isProcessing: false,
    };
    lastUploadId = [];
    selectedUploadId = [];
    resultData = {};
    isLastUploadIdFetched = false;
    // resultData = {
    //     "1": {
    //         "uploader": "admin",
    //         "road_name": "test",
    //         "files": [
    //             {
    //                 "file_id": 1,
    //                 "file_name": "cementation_fissures_0.jpg",
    //                 "classification_result": 6,
    //                 "confidence": 0.9999998807907104,
    //                 "img": "iVBORw0KGgoAAAANSUhEUgAAASwAAACW",
    //             }
    //         ]
    //     },
    // }

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

    async fetchLastUploadId() {
        axiosInstance.get('/irdip/get_lasted_upload_id/')
            .then(response => {
                const uploadId = response.data.upload_id;
                if (uploadId) {
                    this.setLastUploadId(uploadId);
                    console.log('Last upload id:', uploadId);
                }
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }

    fetchResultData() {
        const params = new URLSearchParams();
        this.lastUploadId.forEach(id => params.append('upload_id', id));

        axiosInstance.get('/irdip/get_result', { params })
            .then(response => {
                console.log(response.data);
                this.resultData = response.data;
            })
            .catch(error => {
                console.error('Error fetching upload data: ', error);
            });
    }
}


const imageStore = new ImageStore();
export default imageStore;

