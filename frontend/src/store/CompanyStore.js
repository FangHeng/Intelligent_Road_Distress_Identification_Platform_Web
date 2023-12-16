import { makeAutoObservable } from "mobx";
import uiStore from "./UIStore";

class CompanyStore {
    companyOptions = [];
    employeeNumber = '';

    constructor(uiStore) {
        makeAutoObservable(this);
        this.uiStore = uiStore;
    }

    fetchCompanies = async () => {
        try {
            this.uiStore.startLoading();
            const response = await fetch('http://10.234.114.102:8000/irdip/get_company_info/', {
                method: 'GET',
                Credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            this.companyOptions = Object.entries(data).map(([id, name]) => ({ id, name }));
        } catch (error) {
            console.error("Failed to fetch companies:", error);
        } finally {
            this.uiStore.stopLoading();
        }
    };

    async getEmployeeNumber() {
        try {
            // 发送请求到后端API
            const response = await fetch('/irdip/get_employee_number_length/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',

                },
            });

            // 检查响应状态
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // 解析JSON响应
            const data = await response.json();
            // 处理或返回解析后的数据
            return data.employee_number_length;
        } catch (error) {
            console.error('Fetching employee number length failed:', error);
            // 在错误情况下，可能需要返回一个错误标记或默认值
            return null;
        }
    }

    async fetchEmployeeNumber () {
        this.getEmployeeNumber().then((employee_number_length) => {
            this.employeeNumber = employee_number_length;
        }
        );
    }

    setCompany = (company) => {
        // You can add additional logic here if needed
        console.log("Selected company:", company);
    };
}

const companyStore = new CompanyStore(uiStore);

export default companyStore;
