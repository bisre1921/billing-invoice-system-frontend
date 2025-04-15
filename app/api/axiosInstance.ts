import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api"; 

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            console.error("Unauthorized access - redirecting to login");
            localStorage.removeItem("token");
            window.location.href = "/login"; 
        }
        return Promise.reject(error);
    }
);

interface UserData {
    "address": string,
    "email": string,
    "name": string,
    "password": string,
    "phone": string,
}

interface CompanyData {
    "name": string;
    "email": string;
    "address": string;
    "owner": string;
    "phone": string;
    "industry": string;
    "estabilished_date": string;
    "company_size": string;
}

export const registerUser = (data: UserData) => {
    return api.post("/auth/register/user", data);
}

export const loginUser = (email: string, password: string) => {
    return api.post("/auth/login", {email, password});
}

export const getUser = (userId: string) => {
    return api.get(`/user/${userId}`);
}

export const createCompany = (data: CompanyData) => {
    return api.post("/company/create", data);
}

export const getCompany = (companyId: string) => {
    return api.get(`/company/${companyId}`);
}

export const getAllCustomers = (companyId: string) => {
    return api.get(`/customer/all?company_id=${companyId}`);
}

export const getCustomer = (customerId: string) => {
    return api.get(`/customer/${customerId}`);
}

export const generateInvoice = (data: any) => {
    return api.post("/invoice/generate", data);
}

export const getInvoice = (invoiceId: string) => {
    return api.get(`/invoice/${invoiceId}`);
}
