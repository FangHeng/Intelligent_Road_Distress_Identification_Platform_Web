import { makeAutoObservable } from 'mobx';

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

    async uploadImages(imageData) {
        console.log(imageData);
        this.uploadHint.loading = true;

        try {
            // 替换为您的上传逻辑
            // const response = await someUploadFunction(imageData);
            this.images.push(imageData);
            this.uploadHint.status = 'success';
            this.uploadHint.message = '上传成功';
        } catch (error) {
            this.uploadHint.status = 'error';
            this.uploadHint.message = '上传失败: ' + error.message;
        } finally {
            this.uploadHint.loading = false;
        }
    }
}

const imageStore = new ImageStore();
export default imageStore;

