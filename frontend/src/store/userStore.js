import { makeAutoObservable } from 'mobx';
import MaleAvatar from '../assets/img/Male.png'
import FemaleAvatar from '../assets/img/Female.png'
import axiosInstance from "../utils/AxiosInstance";
// import {fetchWithToken, getCookie} from "../utils/utils";

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
    };
    isLoggedIn = false;
    isLoading = false;
    loginHint = {message:'', status:'error'};
    infoChangeHint = {message:'', status:'error'}
    getInfoHint = {message:'', status:'error'}

    constructor() {
        makeAutoObservable(this);
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
            // ...之后的代码...
        } catch (error) {
            this.isLoggedIn = false;
            this.loginHint.message = '工号或密码错误！';
            this.loginHint.status = 'error';
            console.error('There has been a problem with your axios operation:', error);
        } finally {
            this.isLoading = false;
        }
    }
    // async login(companyID, jobNumber, password) {
    //     try {
    //         this.isLoading = true;
    //         this.loginError = '';
    //
    //         const csrfToken = getCookie('csrftoken'); // 从cookie中获取CSRF token
    //         console.log(csrfToken)
    //
    //         // 使用FormData来发送数据
    //         const formData = new FormData();
    //         formData.append('company_id', companyID);
    //         formData.append('employee_number', jobNumber);
    //         formData.append('password', password);
    //
    //         const response = await fetchWithToken('/irdip/login/', {
    //             method: 'POST',
    //             credentials: 'include',
    //             body: formData, // 发送FormData
    //         });
    //
    //         console.log(response)
    //
    //         // 使用.entries()方法遍历并打印FormData中的内容
    //         for (let [key, value] of formData.entries()) {
    //             console.log(key, value);
    //         }
    //
    //         if (response.ok) {
    //             const data = await response.json();
    //             console.log(data)
    //             this.isLoggedIn = true;
    //             this.loginHint.message = '登陆成功！';
    //             this.loginHint.status = 'success';
    //             // 可以在这里设置token，保存在localStorage等
    //             // 注意：不要存储密码
    //         } else {
    //             this.isLoggedIn = false;
    //             this.loginHint.message = '工号或密码错误！';
    //             this.loginHint.status = 'error';
    //         }
    //     } catch (error) {
    //         this.isLoggedIn = false;
    //         this.loginHint.message = '网络似乎出现了错误，请稍后再试！';
    //         this.loginHint.status = 'error';
    //         console.error('There has been a problem with your fetch operation:', error);
    //     } finally {
    //         this.isLoading = false;
    //     }
    // }

    async logout() {
        try {
            const response = await axiosInstance.post('/irdip/logout/'); // 确保这里的 URL 与后端视图的 URL 匹配
            if (response.data.status === 'success') {
                // 登出成功的逻辑处理
                console.log('Logged out successfully');
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
            this.setUserInfo(userData);
        } else {
            this.getInfoHint.status = 'error'
            this.getInfoHint.message = '获取用户信息失败！'
            callback();
        }
    }

    getAvatarUrl() {
        // 如果 userInfo.avatar 不为空，则返回它
        if (this.userInfo.avatar) {
            return this.userInfo.avatar;
        }

        // 根据性别返回默认头像
        switch (this.userInfo.gender) {
            case 'Male':
                return MaleAvatar;
            case 'Female':
                return FemaleAvatar;
            default:
                return MaleAvatar; // 或者是一个通用的默认头像
        }
    }

    async updateUserInfo(data) {
        try {
            // 发送POST请求到后端API
            const response = await fetch('/irdip/change_user_info/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    phone_number: data.phone,
                    username: data.nickname,
                    gender: data.gender,
                }),
            });

            // 检查响应状态
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // 解析JSON响应
            const responseData = await response.json();

            // 处理响应数据
            return responseData;
        } catch (error) {
            console.error('Updating user info failed:', error);
            // 在错误情况下，可能需要返回一个错误标记或默认值
            return null;
        }
    }

    setUserInfo(userData) {
        this.userInfo = {
            ...this.userInfo,
            ...userData,
        };
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


const userStore = new UserStore();

export default userStore;
