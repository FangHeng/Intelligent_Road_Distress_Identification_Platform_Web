import { makeAutoObservable } from 'mobx';
import {getCookie} from "../utils/utils";

const csrfToken = getCookie('csrftoken'); // 从cookie中获取CSRF token
class ImageStore {
    images = [];
    uploadHint = {
        status: '',  // 'success', 'error', or ''
        message: '',
        loading: false,
    };

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

// 确保 fileList 中的元素是 File 对象
        fileList.forEach(file => {
            console.log(file.originFileObj instanceof File); // 应该打印 true
        });

// 添加其他表单数据到 FormData
        for (const key in imageInfo) {
            formData.append(key, imageInfo[key]);
        }

        for (let [key, value] of formData.entries()) {
            console.log(key + ':', value);

            if (value instanceof File) {
                console.log('File Name:', value.name);
                console.log('File Size:', value.size);
                console.log('File Type:', value.type);
            }
        }

        try {
            const response = await fetch('/irdip/upload/', {
                headers: {
                    'Accept': 'application/json',
                    'X-CSRFToken': csrfToken, // 确保CSRF令牌已正确获取
                },
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();

            this.uploadHint.status = 'success';
            this.uploadHint.message = '文件上传成功！';
            return responseData;
        } catch (error) {
            this.uploadHint.status = 'error';
            this.uploadHint.message = '文件上传失败！';
        } finally {
            this.uploadHint.loading = false;
        }
    }
}

const imageStore = new ImageStore();
export default imageStore;

