import { registerUser } from "@/app/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface UserState {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
}

const initialState: UserState = {
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
}

export const RegisterUser = createAsyncThunk(
    "auth/register/user",
    async (userData: UserState, { rejectWithValue }) => {
        try {
            console.log("User Data: ", userData)
            const response = await registerUser(userData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "An error occurred");
        }
    }
)

const authSlice = createSlice({
    name: "UserRegistration",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(RegisterUser.fulfilled, (state, action) => {
            Object.assign(state, action.payload)
          })
    }
})

export default authSlice.reducer;