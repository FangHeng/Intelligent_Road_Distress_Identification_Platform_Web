import { makeAutoObservable } from "mobx";
import userStore from "./UserStore";

class RoadStore {
    selectedItem = null;
    selectedRegion = { province: '', city: '', district: '' };
    roadData = [];
    isLoading = false;
    hint = {
        status : 'error',
        message: ''
    }

    constructor(userStore) {
        makeAutoObservable(this);
        this.userStore = userStore;
    }

    setSelectedItem(item) {
        this.selectedItem = item;
    }

    setSelectedRegion(province, city, district) {
        this.selectedRegion = { province, city, district };
    }

    saveData(callback) {
        this.isLoading = true;
        console.log(this.selectedItem)
        console.log(this.selectedRegion)
        if (this.selectedItem !== null && this.selectedRegion !== null) {
            const url = '/irdip/road_registration/';
            const dataToSave = {
                region: this.selectedRegion,
                roadDetails: this.selectedItem
            };

            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSave),
            })
                .then(response => {
                    // 检查响应的状态码
                    if (!response.ok) {
                        // 如果响应状态不是OK，则解析错误消息
                        return response.json().then(errData => {
                            throw new Error(errData.message || '发生未知错误');
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    this.isLoading = false;
                    if (data.status === 'success') {
                        this.hint.status = 'success';
                        this.hint.message = "保存成功！";
                    } else {
                        this.hint.status = 'error';
                        this.hint.message = data.message || '保存失败，请稍后再试！';
                    }
                    callback(); // 调用回调
                })
                .catch((error) => {
                    console.error('Error:', error);
                    this.isLoading = false;
                    this.hint.status = 'error';
                    this.hint.message = error.message || '保存失败，请稍后再试！';
                    callback(); // 调用回调
                });
        } else {
            this.isLoading = false;
            this.hint.status = 'warning';
            this.hint.message = '请输入完整信息！';
            callback(); // 调用回调
        }
    }

    async getRoadData() {
        try {
            const url = '/irdip/get_road_info';
            const response = await fetch(
                url,{
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                this.roadData = Object.values(data);
                console.log(this.roadData)
            } else {
                console.error('Failed to fetch road data:', response.status);
            }
        } catch (error) {
            console.error('Error fetching road data:', error);
        }
    }
}

const roadStore = new RoadStore(userStore);
export default roadStore;
