import {makeAutoObservable} from 'mobx';
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
    loginHint = {message:'', status:'error'};
    infoChangeHint = { status: null, message: '' };
    getInfoHint = {message:'', status:'error'};
    subordinatesInfo = {};
    errorsubordinatesInfo = false;

    constructor() {
        makeAutoObservable(this);
    }

    setUserInfo(userData) {
        this.userInfo = {
            ...this.userInfo,
            ...userData,
        };
        console.log(this.userInfo)
    }


    async login(companyID, jobNumber, password) {
        try {
            this.isLoading = true;
            this.loginError = '';

            // 使用FormData来发送数据
            const formData = new FormData();
            formData.append('company_id', companyID);
            formData.append('employee_number', jobNumber);
            formData.append('password', password);

            const response = await axiosInstance({
                url: '/irdip/login/',
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                withCredentials: true, // 相当于 fetch 中的 credentials: 'include'
                data: formData,
            });

            // 直接处理响应数据
            const data = response.data;
            this.isLoggedIn = true;
            this.loginHint.message = '登陆成功！';
            this.loginHint.status = 'success';
            localStorage.setItem('isLoggedIn', 'true');
        } catch (error) {
            this.isLoggedIn = false;
            this.loginHint.message = '工号或密码错误！';
            this.loginHint.status = 'error';
            console.error('There has been a problem with your axios operation:', error);
        } finally {
            this.isLoading = false;
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


    async fetchUserInfo(callback) {
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
        } else {
            this.getInfoHint.status = 'error'
            this.getInfoHint.message = '获取用户信息失败！'
            callback();
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
                this.infoChangeHint = {
                    message: response.data.message,
                    status: 'success'
                };
                this.fetchUserInfo();
            }else{
                this.infoChangeHint = {
                    message: response.data.message,
                    status: 'error'
                };
            }
            return response.data;
        } catch (error) {
            // 错误处理
            console.error('Updating user info failed:', error);
            this.infoChangeHint = {
                message: error.response?.data?.error || '更新用户信息时出现错误',
                status: 'error'
            };
            return null;
        }
    }

    setPreferredModel(model) {
        this.userInfo.selected_model = model;
        console.log(this.userInfo.selected_model)
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
            // 网络或其他错误
            return { success: false, message: '网络错误或服务器错误' };
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
                this.fetchUserInfo();
                this.infoChangeHint = {
                    message: '头像上传成功！',
                    status: 'success'
                };
            } else {
                this.infoChangeHint = {
                    message: response.data.error || '上传失败',
                    status: 'error'
                };
            }
        } catch (error) {
            this.infoChangeHint = {
                message: '服务器出了问题，请稍后再试！',
                status: 'error'
            };
        }
    }

    async fetchSubordinatesInfo() {
        // 检查用户级别
        if (this.userInfo.user_level === 'Level 0' || this.userInfo.user_level === 'Level 1') {
            try {
                const response = await axiosInstance.get('/irdip/get_subordinates_info/');
                if (response.status === 200) {
                    this.errorsubordinatesInfo = false;
                    this.subordinatesInfo = response.data;
                } else {
                    this.errorsubordinatesInfo = true;
                    console.error('Error during fetch: ', response);
                }
            } catch (error) {
                this.errorsubordinatesInfo = true;
                console.error('Error during fetch: ', error);
            }
        } else {
            this.errorsubordinatesInfo = true;
            console.log('Unauthorized to access subordinates information');
        }
    }


    sendPreferredModel = async (selectedModel) => {
        const formData = new FormData();
        formData.append('update_model', selectedModel);

        try {
            const response = await axiosInstance.post('/irdip/change_selected_model/', formData);

            console.log('Model updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating model:', error.response?.data || error.message);
        }
    };

    deleteSubordinate(userId) {
        return axiosInstance.delete(`/irdip/delete_subordinate/${userId}`)
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
                return { success: false, message: error.response?.data?.message || '删除用户失败' };
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
