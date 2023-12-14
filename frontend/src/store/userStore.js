import { makeAutoObservable } from 'mobx';

class UserStore {
    userInfo = {
        jobNumber: '',
        userLevel: '',
        username: '',
        gender: '',
        phone: '',
        email: '',
        companyID: '',
        companyName: '',
        avatar: '',
        numberCode: 0,
    };
    isLoggedIn = false;
    isLoading = false;
    loginHint = {message:'', status:'error'};
    infoChangeHint = {message:'', status:'error'}

    constructor() {
        makeAutoObservable(this);
    }

    async login(companyID, jobNumber, password) {
        try {
            this.isLoading = true;
            this.loginError = '';
            // const response = await fetch('http://your-backend-url/api/login', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ jobNumber, password }),
            // });
            //
            // if (response.ok) {
            //     const data = await response.json();
            //     this.userInfo = { ...data, jobNumber };
            //     this.isLoggedIn = true;
            //     // 在这里还可以设置 token，保存在 localStorage 等
            // } else {
            //     // 处理错误，例如显示登录失败的消息
            //     this.loginError = '工号或密码错误！';
            // }
            console.log(companyID, jobNumber, password);
            if (companyID === '1' && jobNumber === '123' && password === '123'){
                this.isLoggedIn = true;
                this.loginHint.message = '登陆成功！';
                this.loginHint.status = 'success';
            }else {
                this.isLoggedIn = false;
                this.loginHint.message = '工号或密码错误！';
                this.loginHint.status = 'error';
            }
        } catch (error) {
            // 处理错误
            this.loginHint.message = '网络似乎出现了错误，请稍后再试！';
            this.loginHint.status = 'error';
            console.error('There has been a problem with your fetch operation:', error);
        }finally {
            this.isLoading = false;
        }
    }

    async fetchUserInfo() {
        // 假设这是一个调用后端 API 获取用户信息的函数
        const userData = await fetchUserFromDatabase();
        this.setUserInfo(userData);
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
        this.userInfo = userData;
    }
}

function fetchUserFromDatabase() {
    // // 使用 fetch API 向 Django 后端发送请求
    // return fetch('http://your-backend-url/api/user-info')
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json(); // 解析 JSON 数据
    //     })
    //     .then(data => {
    //         // 返回的数据是用户信息
    //         return {
    //             name: data.name, // 假设返回的数据中有 'name'
    //             avatar: data.avatar // 假设返回的数据中有 'avatar' 的路径
    //         };
    //     })
    //     .catch(error => {
    //         // 在这里处理错误情况
    //         console.error('There has been a problem with your fetch operation:', error);
    //
    //     });
    // return new Promise((resolve) => {
    //     setTimeout(() => {
    //         resolve({ name: 'John Doe', avatar: {MaleAvatar} });
    //     }, 1000);
    // });
    const userLevelMap = {
        '0': 'root',
        '1': '管理员',
        '2': '普通用户',
    };

    const userLevel = '0';

    return {
        jobNumber: '000000',
        // 进行转换一下，将数字转换为对应的字符串
        userLevel: userLevelMap[userLevel],
        username: 'John Doe',
        password: '123456',
        gender: 'male',
        phone: '00000000000',
        email: '123@qq.com',
        companyID: '000000',
        companyName: '重庆大学',
        avatar: '../assets/Male.png',
        numberCode: 4,
    }

}

export const userStore = new UserStore();
