"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { loginUser } from "../api/axiosInstance"
import jwtDecode from '../utils/jwtDecode'

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

    const scheduleAutoLogout = (exp: number) => {
        const currentTime = Date.now() / 1000 
        const timeLeft = exp - currentTime

        if (timeLeft <= 0) {
            logout()
        } else {
            setTimeout(() => {
                logout()
            }, timeLeft * 1000) 
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        const storedUserInfo = localStorage.getItem("userInfo")

        if (token && storedUserInfo) {
            const decoded: any = jwtDecode(token)
            const exp = decoded.exp

            if (Date.now() / 1000 >= exp) {
                logout()
            } else {
                setUserToken(token)
                setUserInfo(JSON.parse(storedUserInfo))
                scheduleAutoLogout(exp)
            }
        }

        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true)
            const response = await loginUser(email, password)
            const { token } = response.data
            const decoded: any = jwtDecode(token)

            localStorage.setItem("token", token)
            localStorage.setItem("userInfo", JSON.stringify(decoded))

            setUserToken(token)
            setUserInfo(decoded)

            scheduleAutoLogout(decoded.exp)
        } catch (error) {
            console.error("Login error:", error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        localStorage.clear() 
        setUserToken(null)
        setUserInfo(null)
        setIsLoading(false)
    }

    return (
        <AuthContext.Provider 
            value={{
                isLoading,
                userToken,
                userInfo,
                login,
                logout,
                isAuthenticated: !!userToken
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
