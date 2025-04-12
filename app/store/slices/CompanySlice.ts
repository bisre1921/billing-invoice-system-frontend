import { createCompany } from "@/app/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface CompanyState {
    name: string;
    email: string;
    address: string;
    owner: string;
    phone: string;
    industry: string;
    estabilished_date: string;
    company_size: string;
}

const initialState: CompanyState = {
    name: "",
    email: "",
    address: "",
    owner: "",
    phone: "",
    industry: "",
    estabilished_date: "",
    company_size: "",
}

export const CreateCompany = createAsyncThunk(
    "company/create",
    async (companyData: CompanyState, { rejectWithValue }) => {
        try {
            console.log("Company Data: ", companyData)
            const response = await createCompany(companyData);
            console.log("Company Registration Response: ", response.data)
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "An error occurred");
        }
    }
)

const companySlice = createSlice({
    name: "CompanyRegistration",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(CreateCompany.fulfilled, (state, action) => {
            Object.assign(state, action.payload)
          })
    }

})

export default companySlice.reducer;