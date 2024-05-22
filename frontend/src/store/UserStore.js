import {makeAutoObservable, observable, action} from 'mobx';
import MaleAvatar from '../assets/img/Male.png'
import FemaleAvatar from '../assets/img/Female.png'
import axiosInstance from "../utils/AxiosInstance";

class UserStore {
    userInfo = {
        user_id: 0,
        username: '',
        employee_number: '',
        phone_number: '',
        user_level: '',
        gender: '',
        email: '',
        company_name: '',
        avatar: '',
        upload_count: 0,
        selected_model : 'WSPLIN-IP',
    };
    isLoggedIn = false;
    isLoading = false;
    loginHint = {message:'', status:null};
    infoChangeHint = { status: null, message: '' };
    getInfoHint = {message:'', status:null};
    subordinatesInfo = [];

    constructor() {
        makeAutoObservable(this, {
            userInfo: observable,
            isLoggedIn: observable,
            isLoading: observable,
            loginHint: observable,
            infoChangeHint: observable,
            getInfoHint: observable,
            subordinatesInfo: observable,
            setUserInfo: action,
            setIsLoggedIn: action,
            setIsLoading: action,
            setSubordinatesInfo: action,
            setInfoChangeHint: action,
            login: action,
            logout: action,
            fetchUserInfo: action,
            updateUserInfo: action,
            setPreferredModel: action,
            changePassword: action,
            changeAvatar: action,
            fetchSubordinatesInfo: action,
            sendPreferredModel: action,
            deleteSubordinate: action,
        });
    }

    setUserInfo(userData) {
        this.userInfo = {
            ...this.userInfo,
            ...userData,
        };
        console.log(this.userInfo)
    }

    setIsLoggedIn(isLoggedIn) {
        this.isLoggedIn = isLoggedIn;
    }

    setIsLoading(isLoading) {
        this.isLoading = isLoading;
    }

    setSubordinatesInfo(subordinatesInfo) {
        this.subordinatesInfo = subordinatesInfo;
    }

    setInfoChangeHint(infoChangeHint) {
        this.infoChangeHint = infoChangeHint;
    }

    async login(companyID, jobNumber, password) {
        try {
            // 设置isLoading为true，表示正在登录
            this.setIsLoading(true);

            // 使用FormData来发送数据
            const formData = new FormData();
            formData.append('company_id', companyID);
            formData.append('employee_number', jobNumber);
            formData.append('password', password);
            await axiosInstance({
                url: '/irdip/login/',
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                withCredentials: true,
                data: formData,
            });
            this.loginHint = {
                status: true,
                message: '登录成功！',
            }
            this.setIsLoggedIn(true);
            localStorage.setItem('isLoggedIn', 'true');
        } catch (error) {
            this.setIsLoggedIn(false);
            this.loginHint = {
                status: false,
                message: '登录失败，请检查账号密码！',
            }
        } finally {
            this.setIsLoading(false);
        }
    }

    async logout() {
        try {
            const response = await axiosInstance.post('/irdip/logout/');
            if (response.data.status === 'success') {
                // 登出成功的逻辑处理
                console.log('Logged out successfully');
                this.isLoggedIn = false;
                localStorage.removeItem('isLoggedIn');
            } else {
                // 处理错误情况
                console.error('Logout failed:', response.data.message);
            }
        } catch (error) {
            // 网络错误或服务器错误的处理
            console.error('Error during logout:', error);
        }
    }


    async fetchUserInfo() {
        const userData = await fetchUserFromDatabase();
        if (userData) {
            // 如果 userData 中的 avatar 为空，则根据性别设置默认头像
            if (!userData.avatar) {
                userData.avatar = getDefaultAvatar(userData.gender);
            } else {
                // 否则，将 avatar 转换为 base64 格式
                userData.avatar = `data:image/jpeg;base64,${userData.avatar}`;
            }

            this.setUserInfo({ ...this.userInfo, ...userData });
            this.getInfoHint.status = 'success'
        } else {
            this.getInfoHint.status = 'error'
            this.getInfoHint.message = '获取用户信息失败！'
        }
    }

    async updateUserInfo(data) {
        try {
            console.log(data)
            const formData = new FormData();
            formData.append('email', data.email);
            formData.append('phone_number', data.phone);
            formData.append('username', data.nickname);
            formData.append('gender', data.gender);

            // 打印FormData中的内容
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const response = await axiosInstance.post('/irdip/change_user_info/', formData);

            // 根据响应更新 userStore 中的 infoChangeHint
            if (response.status === 200) {
                // 成功更新用户信息
                this.setInfoChangeHint({
                    message: '用户信息更新成功！',
                    status: 'success'
                })
                await this.fetchUserInfo();
            }else{
                this.setInfoChangeHint({
                    message: '用户信息更新失败！',
                    status: 'error'
                })
            }
            return response.data;
        } catch (error) {
            // 错误处理
            console.error('Updating user info failed:', error);
            if (error.response.status === 502) {
                this.setInfoChangeHint({
                    message: error.response?.data?.error || '并未作出修改！',
                    status: 'warning'
                })
            } else {
                this.setInfoChangeHint({
                    message: error.response?.data?.error || '更新用户信息时出现错误！',
                    status: 'error'
                })
            }
            return null;
        }
    }

    setPreferredModel(model) {
        this.userInfo.selected_model = model;
    }

    async changePassword(oldPassword, newPassword) {
        try {
            const formData = new FormData();
            formData.append('old_password', oldPassword);
            formData.append('new_password', newPassword);

            const response = await axiosInstance.post('/irdip/change_password/', formData);

            if (response.data.status === 'success') {
                // 密码修改成功
                return { success: true, message: '密码修改成功！' };
            } else {
                // 密码修改失败
                return { success: false, message: '密码修改失败！'};
            }
        } catch (error) {
            switch (error.response.status) {
                case 400: {
                    // 旧密码错误
                    return { success: false, message: '旧密码错误！' };
                }
                default: {
                    // 网络或其他错误
                    return { success: false, message: '网络错误或服务器错误' };
                }
            }
        }
    }

    changeAvatar = async (file) => {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            // 打印FormData中的内容
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            // 使用axios发送请求
            const response = await axiosInstance.post('/irdip/upload_avatar/', formData);

            // 根据响应内容更新状态
            if (response.status === 200) {
                await this.fetchUserInfo();

                this.setInfoChangeHint({
                    message: '头像上传成功！',
                    status: 'success'
                });
            }
        } catch (error) {
            this.setInfoChangeHint({
                message: '头像上传失败，请稍后再试！',
                status: 'error'
            });
            console.error('Error during avatar upload:', error);
        }
    }

    async fetchSubordinatesInfo() {
        // 检查用户级别
        if (this.userInfo.user_level === 'Level 0' || this.userInfo.user_level === 'Level 1') {
            try {
                const response = await axiosInstance.get('/irdip/get_subordinates_info/');
                if (response.status === 200) {
                    this.setSubordinatesInfo(response.data);
                    return { success: true };
                }
            } catch (error) {
                console.error('Error during fetch: ', error);
                return { success: false, message: '获取下属信息失败！' };
            }
        } else {
            return { success: false, message: '您没有权限获取下属信息！' };
        }
    }


    sendPreferredModel = async (selectedModel) => {
        const formData = new FormData();
        formData.append('update_model', selectedModel);

        try {
            const response = await axiosInstance.post('/irdip/change_selected_model/', formData);

            console.log('Model updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating modelStructure:', error.response?.data || error.message);
        }
    };

    deleteSubordinate(userId) {
        return axiosInstance.delete(`/irdip/delete_subordinate/${userId}/`)
            .then(response => {
                if (response.data.status === 'success') {
                    // 返回成功的消息
                    return { success: true, message: response.data.message };
                } else {
                    // 返回失败的消息
                    return { success: false, message: response.data.message };
                }
            })
            .catch(error => {
                // 返回错误的消息
                return { success: false, message: error.response?.data?.message || '删除用户失败！' };
            });
    }

}

// 异步函数，用于从数据库获取用户信息
async function fetchUserFromDatabase() {
    try {
        // 发送请求到后端API
        const response = await fetch('/irdip/get_user_info/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        // 检查响应状态
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 解析JSON响应
        const data = await response.json();
        console.log(data)
        // 返回解析后的数据
        return data;
    } catch (error) {
        console.error('Fetching user data failed:', error);
        // 在错误情况下，可能需要返回一个错误标记或默认值
        return null;
    }
}

const getDefaultAvatar = (gender) => {
    switch (gender) {
        case 'Male':
            return MaleAvatar;
        case 'Female':
            return FemaleAvatar;
        default:
            return MaleAvatar; // 或者是一个通用的默认头像
    }
}


const userStore = new UserStore();

export default userStore;
