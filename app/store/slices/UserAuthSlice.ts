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
            // Handle the specific error structure from backend
            if (error.response?.data?.error) {
                return rejectWithValue(error.response.data.error);
            } else if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            } else if (error.message) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("An error occurred during registration");
            }
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
          .addCase(RegisterUser.rejected, (state, action) => {
            // Handle rejected case - the error message will be passed to the component
            console.error("Registration failed:", action.payload);
          })
    }
})

export default authSlice.reducer;