import { makeAutoObservable } from "mobx";
import uiStore from "./UIStore";

class CompanyStore {
    companyOptions = [];

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

    setCompany = (company) => {
        // You can add additional logic here if needed
        console.log("Selected company:", company);
    };
}

const companyStore = new CompanyStore(uiStore);

export default companyStore;
