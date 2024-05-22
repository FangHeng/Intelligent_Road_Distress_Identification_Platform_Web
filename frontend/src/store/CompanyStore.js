import {action, makeAutoObservable, observable} from "mobx";
import axios from "axios";
import axiosInstance from "../utils/AxiosInstance";

class CompanyStore {
    companyOptions = [];
    employeeNumber = 0;

    constructor() {
        makeAutoObservable(this, {
            companyOptions: observable,
            employeeNumber: observable,
            setCompanyOptions: action,
            setEmployeeNumber: action,
            fetchCompanies: action,
            fetchEmployeeNumber: action,
        });
    }

    setCompanyOptions(companyOptions) {
        this.companyOptions = companyOptions;
    }

    setEmployeeNumber(employeeNumber) {
        this.employeeNumber = employeeNumber;
    }

    fetchCompanies = async () => {
        try {
            const response = await axios.get('/irdip/get_company_info/', {
                withCredentials: true,
            });

            const data = response.data;
            this.setCompanyOptions(Object.entries(data).map(([id, name]) => ({id, name})));
        } catch (error) {
            throw error; // 重新抛出错误
        } finally {
        }
    };

    async getEmployeeNumber() {
        try {
            const response = await axiosInstance.get('/irdip/get_employee_number_length/');

            // 处理或返回解析后的数据
            return response.data.employee_number_length;
        } catch (error) {
            console.error('Fetching employee number length with axios failed:', error);

            return { success: false, message: '获取员工工号长度失败！'};
        }
    }


    async fetchEmployeeNumber() {
        this.getEmployeeNumber().then((employee_number_length) => {
                this.setEmployeeNumber(employee_number_length);
            }
        );
    }

}

const companyStore = new CompanyStore();

export default companyStore;
