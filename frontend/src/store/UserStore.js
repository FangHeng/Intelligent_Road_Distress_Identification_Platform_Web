import { makeAutoObservable } from 'mobx';
import {getCookie} from "../utils/utils";

class UserStore {
    userInfo = {
        jobNumber: '',
        userLevel: '',
        username: '',
        gender: '',
        phone: '',
        email: '',
        companyName: '',
        avatar: '',
        numberCode: 0,
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

            const csrfToken = getCookie('csrftoken'); // 从cookie中获取CSRF token
            console.log(csrfToken)

            // 使用FormData来发送数据
            const formData = new FormData();
            formData.append('company_id', companyID);
            formData.append('employee_number', jobNumber);
            formData.append('password', password);

            const response = await fetch('/irdip/login/', {
                headers: {
                    'Accept': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                method: 'POST',
                credentials: 'include',
                body: formData, // 发送FormData
            });

            // 使用.entries()方法遍历并打印FormData中的内容
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            if (response.ok) {
                const data = await response.json();
                this.userInfo = { ...data, jobNumber, companyID };
                this.isLoggedIn = true;
                this.loginHint.message = '登陆成功！';
                this.loginHint.status = 'success';
                // 可以在这里设置token，保存在localStorage等
                // 注意：不要存储密码
            } else {
                this.isLoggedIn = false;
                this.loginHint.message = '工号或密码错误！';
                this.loginHint.status = 'error';
            }
        } catch (error) {
            this.isLoggedIn = false;
            this.loginHint.message = '网络似乎出现了错误，请稍后再试！';
            this.loginHint.status = 'error';
            console.error('There has been a problem with your fetch operation:', error);
        } finally {
            this.isLoading = false;
        }
    }


    async fetchUserInfo(callback) {
        const userData = await fetchUserFromDatabase();
        if (userData) {
            this.setUserInfo(userData);
            console.log(this.userInfo)
        } else {
            this.getInfoHint.status = 'error'
            this.getInfoHint.message = '获取用户信息失败！'
            callback();
        }
    }

    async updateUserInfo(data) {
        // // 与后端交互
        // try {
        //     const response = await fetch('http://your-backend-url/api/update-user-info', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(this.userInfo),
        //     });
        //
        //     if (response.ok) {
        //         // 更新状态
        //         this.userInfo = {
        //             ...this.userInfo,
        //             ...data,
        //         };
        //         this.infoChangeHint.status = 'success'
        //         this.infoChangeHint.message = '信息修改成功！'
        //     }else{
        //         this.infoChangeHint.status = 'error'
        //         this.infoChangeHint.message = '信息修改失败！'
        //         throw new Error('Network response was not ok');
        //     }
        this.userInfo = {
            ...this.userInfo,
            ...data,
        };
        this.infoChangeHint.status = 'success'
        this.infoChangeHint.message = '信息修改成功！'
        // } catch (error) {
        //     this.infoChangeHint.status = 'error'
        //     this.infoChangeHint.message = '信息修改失败！'
        //     console.error('There has been a problem with your fetch operation:', error);
        // }
    }

    setUserInfo(userData) {
        // 更新userStore中的userInfo
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

    // const userLevelMap = {
    //     '0': 'root',
    //     '1': '管理员',
    //     '2': '普通用户',
    // };
    //
    // const userLevel = '0';
    //
    // return {
    //     jobNumber: '000000',
    //     // 进行转换一下，将数字转换为对应的字符串
    //     userLevel: userLevelMap[userLevel],
    //     username: 'John Doe',
    //     password: '123456',
    //     gender: 'male',
    //     phone: '00000000000',
    //     email: '123@qq.com',
    //     companyID: '000000',
    //     companyName: '重庆大学',
    //     avatar: '../assets/Male.png',
    //     numberCode: 4,
    // }


const userStore = new UserStore();

export default userStore;
