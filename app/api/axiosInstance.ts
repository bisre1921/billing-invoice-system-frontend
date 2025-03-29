import axios from "axios";

const API_BASE_URL = "to be defined"; 

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
    "address": "string",
    "email": "string",
    "id": "string",
    "name": "string",
    "password": "string",
    "phone": "string",
}

export const registerUser = (data: UserData) => {
    return api.post("/auth/register/user", data);
}