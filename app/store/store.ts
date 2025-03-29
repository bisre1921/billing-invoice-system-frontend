import { configureStore } from "@reduxjs/toolkit";
import userRegistrationReducer from "./slices/UserAuthSlice";

export const store = configureStore({
    reducer: {
        UserRegistration: userRegistrationReducer,
    }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
