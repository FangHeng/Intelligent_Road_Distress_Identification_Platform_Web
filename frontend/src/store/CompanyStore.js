import { makeAutoObservable } from "mobx";
import uiStore from "./UIStore";
import axios from "axios";

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
            const response = await axios.get('/irdip/get_company_info/', {
                withCredentials: true,
            });

            const data = response.data;
            console.log(data);
            this.companyOptions = Object.entries(data).map(([id, name]) => ({ id, name }));
        } catch (error) {
            console.error("Failed to fetch companies with axios:", error);
        } finally {
            this.uiStore.stopLoading();
        }
    };

    async getEmployeeNumber() {
        try {
            const response = await axios.get('/irdip/get_employee_number_length/', {
                withCredentials: true,
            });

            // 处理或返回解析后的数据
            return response.data.employee_number_length;
        } catch (error) {
            console.error('Fetching employee number length with axios failed:', error);
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
