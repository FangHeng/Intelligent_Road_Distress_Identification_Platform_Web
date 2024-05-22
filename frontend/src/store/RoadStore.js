import {action, makeAutoObservable, observable} from "mobx";
import userStore from "./UserStore";
import axiosInstance from "../utils/AxiosInstance";

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
        makeAutoObservable(this, {
            selectedItem: observable,
            selectedRegion: observable,
            roadData: observable,
            isLoading: observable,
            hint: observable,
            setSelectedItem: action,
            setSelectedRegion: action,
            setIsLoading: action,
            saveData: action,
            fetchRoadData: action,
        });
        this.userStore = userStore;
    }

    setSelectedItem(item) {
        this.selectedItem = item;
    }

    setSelectedRegion(province, city, district) {
        this.selectedRegion = { province, city, district };
    }

    setIsLoading(value) {
        this.isLoading = value;
    }

    saveData(callback) {
        this.setIsLoading(true);
        if (this.selectedItem !== null && this.selectedRegion !== null) {
            const url = '/irdip/road_registration/';
            const dataToSave = {
                region: this.selectedRegion,
                roadDetails: this.selectedItem
            };
            console.log(dataToSave)

            axiosInstance.post(url, dataToSave)
                .then(response => {
                    this.setIsLoading(false);
                    const data = response.data;
                    if (data.status === 'success') {
                        this.hint.status = 'success';
                        this.hint.message = "保存成功！";
                        this.fetchRoadData(); // 保存成功后立即获取最新数据
                    } else {
                        this.hint.status = 'error';
                        this.hint.message = data.message || '保存失败，请稍后再试！';
                    }
                    callback(); // 调用回调
                })
                .catch((error) => {
                    console.error('Error:', error);
                    this.setIsLoading(false);
                    this.hint.status = 'error';
                    this.hint.message = error.response?.data?.message || '保存失败，请稍后再试！';
                    callback(); // 调用回调
                });
        } else {
            this.setIsLoading(false);
            this.hint.status = 'warning';
            this.hint.message = '请输入完整信息！';
            callback(); // 调用回调
        }
    }

    async fetchRoadData() {
        try {
            const url = '/irdip/get_road_info/';
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
