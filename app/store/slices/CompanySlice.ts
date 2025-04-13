import { createCompany, getCompany } from "@/app/api/axiosInstance";
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
            localStorage.setItem("company", JSON.stringify(response.data))
            console.log("Company Data saved to local storage")
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "An error occurred");
        }
    }
)

// export const GetCompany = createAsyncThunk(
//     "/company/:id",
//     async (_, { rejectWithValue }) => {
//         try {
//             const localStorageCompany = JSON.parse(localStorage.getItem("company") || "{}");
//             console.log("Local Storage Company Data: ", localStorageCompany)
//             const companyId = localStorageCompany.company_id;
//             console.log("Company ID: ", companyId)
//             const response = await getCompany(companyId);
//             console.log("Company Data: ", response.data)
//             return response.data;
//         } catch (error: any) {
//             return rejectWithValue(error.response.data.message || "Failed to fetch company data");
//         }
//     }
// )

const companySlice = createSlice({
    name: "CompanyRegistration",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(CreateCompany.fulfilled, (state, action) => {
            Object.assign(state, action.payload)
          })
        //   .addCase(GetCompany.fulfilled, (state, action) => {
        //     Object.assign(state, action.payload);
        //   });
    }

})

export default companySlice.reducer;