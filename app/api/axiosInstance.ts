import axios, { AxiosResponse } from "axios";

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
            window.location.href = "/auth/LoginUser"; 
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

interface UpdateUserProfileData { 
    "name"?: string;
    "email"?: string;
    "phone"?: string;
    "address"?: string;
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

interface CustomerForecastResponse {
    itemId: string;
    itemName: string;
    predicted_average_Quantity: number;
}

interface ItemForecastResponse {
    itemId: string;
    itemName: string;
    predictedAverageQuantity: number;
    rmse: number;
}

export const getCustomerItemForecast = (customerId: string): Promise<AxiosResponse<CustomerForecastResponse[]>> => {
    return axios.get(`http://127.0.0.1:8000/customer/forecast/${customerId}`);
};

export const getBulkItemForecast = (): Promise<AxiosResponse<ItemForecastResponse[]>> => {
    return axios.get(`http://127.0.0.1:8000/items/Items-forecast`);
};

export const registerUser = (data: UserData) => {
    return api.post("/auth/register/user", data);
}

export const loginUser = (email: string, password: string) => {
    return api.post("/auth/login", {email, password});
}

export const getUser = (userId: any) => {
    return api.get(`/user/${userId}`);
}

export const updateUser = (userId: string, data: UpdateUserProfileData) => {
    return api.put(`/user/update/${userId}`, data);
}

export const checkComapnyForUser = (userId: string) => {
    return api.get(`/company/user/${userId}`);
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

export const addCustomer = (data: any) => {
    return api.post("/customer/register", data);
}

export const deleteCustomer = (customerId: string) => {
    return api.delete(`/customer/delete/${customerId}`);
}

export const updateCustomer = (customerId: string, data: any) => {
    return api.put(`/customer/update/${customerId}`, data);
}

export const generateInvoice = (data: any) => {
    return api.post("/invoice/generate", data);
}

export const getInvoice = (invoiceId: string) => {
    return api.get(`/invoice/${invoiceId}`);
}

export const getInvoicesByCompany = (companyId: string) => {
    return api.get(`/invoice/companies/${companyId}`);
}

export const addItem = (data: any) => {
    return api.post("/item/add", data);
}

export const getAllItems = (companyId: string) => {
    return api.get(`/item/company/${companyId}`);
}

export const getItem = (itemId: string) => {
    return api.get(`/item/${itemId}`);
}

export const updateItem = (itemId: string, data: any) => {
    return api.put(`/item/update/${itemId}`, data);
}

export const deleteItem = (itemId: string) => {
    return api.delete(`/item/delete/${itemId}`);
}

export const downloadInvoiceApi = (invoiceId: string) => {
    return api.get(`/invoice/download/${invoiceId}`, {
      responseType: "blob",
    });
};

export const sendInvoiceViaEmail = (invoiceId: any) => {
    return api.post(`/invoice/send/${invoiceId}`);
}


export const addEmployee = (data: any) => {
    return api.post("/employee/add", data);
}

export const getAllEmployees = (companyId: string) => {
    return api.get(`/employee/all?company_id=${companyId}`);
}   

export const getEmployee = (employeeId: string) => {
    return api.get(`/employee/${employeeId}`);
}

export const deleteEmployee = (employeeId: string) => {
    return api.delete(`/employee/delete/${employeeId}`);
}

export const updateEmployee = (employeeId: string, data: any) => {
    return api.put(`/employee/update/${employeeId}`, data);
}

export const generateReport = (data: any) => {
    return api.post("/report/generate", data);
}

export const getReport = (reportId: string) => {
    return api.get(`/report/${reportId}`);
}

export const getAllReportsByCompany = (companyId: string) => {
    return api.get(`/report/companies/${companyId}`);
}

export const downloadReportApi = (reportId: string) => {
    return api.get(`/report/download/${reportId}`, {
      responseType: "blob",
    });
};

export const markInvoiceAsPaid = (invoiceId: string, paymentDate?: string) => {
    const payload: { payment_date?: string } = {};
    if (paymentDate) {
      payload.payment_date = `${paymentDate}T00:00:00Z`;
    }
    return api.put(`/invoice/mark-as-paid/${invoiceId}`, payload);
  };

export const importItemsFromCsv = (file: File, companyId: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("company_id", companyId);
    
    return api.post("/item/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };