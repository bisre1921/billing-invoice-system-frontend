import { configureStore } from "@reduxjs/toolkit";
import userRegistrationReducer from "./slices/UserAuthSlice";
import companyRegistrationReducer from "./slices/CompanySlice";

export const store = configureStore({
    reducer: {
        UserRegistration: userRegistrationReducer,
        CompanyRegistration: companyRegistrationReducer,
    }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
