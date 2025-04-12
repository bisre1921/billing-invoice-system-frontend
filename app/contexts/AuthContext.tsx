"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { loginUser } from "../api/axiosInstance"
import jwtDecode from '../utils/jwtDecode';

interface AuthContextType  {
    isLoading: boolean;
    userToken: string | null;
    userInfo: any;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    isLoading: true,
    userToken: null,
    userInfo: null,
    login: async () => {},
    logout: () => {},
    isAuthenticated: false,
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [userToken, setUserToken] = useState<string | null>(null)
    const [userInfo, setUserInfo] = useState<any>(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        console.log("Token from localStorage: ", token)
        const storedUserInfo = localStorage.getItem("userInfo")

        if (token && storedUserInfo) {
            setUserToken(token)
            setUserInfo(JSON.parse(storedUserInfo))
        }
        setIsLoading(false)

    }, [])

    const login = async (email: string, password: string) => {
        try {
          setIsLoading(true);
          const response = await loginUser(email, password);
          console.log("Login response: ", response);
      
          const { token } = response.data;
          const decoded = jwtDecode(token);
      
          try {
            localStorage.setItem("token", token);
            localStorage.setItem("userInfo", JSON.stringify(decoded));
          } catch (storageError) {
            console.error("Error saving to localStorage: ", storageError);
          }
      
          setUserToken(token);
          setUserInfo(decoded);
        } catch (error) {
          console.error("Login error: ", error);
          throw error;
        } finally {
          setIsLoading(false);
        }
      };
      

    const logout = async () => {
        setIsLoading(true)
        localStorage.removeItem("token")
        localStorage.removeItem("userInfo")

        setUserToken(null)
        setUserInfo(null)
        setIsLoading(false)
    }

    return (
        <AuthContext.Provider 
            value = {{
                isLoading, 
                userToken, 
                userInfo, 
                login, 
                logout, 
                isAuthenticated: !!userToken, 
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
