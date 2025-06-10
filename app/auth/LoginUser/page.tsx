"use client"

import { checkComapnyForUser, getCompany } from '@/app/api/axiosInstance';
import { useAuth } from '@/app/contexts/AuthContext';
import { useAppDispatch } from '@/app/store/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaEnvelope, FaLock } from 'react-icons/fa';

interface FormData {
    email: string;
    password: string;
}

const LoginUser = () => {
    const [loading, setLoading] = useState(false);
    const [checkCompanyLoading, setCheckCompanyLoading] = useState(false);
    const [checkCompanyError, setCheckCompanyError] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { login, isAuthenticated, userInfo } = useAuth(); 

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    useEffect(() => {
        if (isAuthenticated && userInfo?.user_id) {
            console.log("User is authenticated, checking for company...");
            checkCompanyAfterLogin(userInfo.user_id);
        } else if (isAuthenticated) {
            console.log("User authenticated, waiting for user info...");
        }
    }, [isAuthenticated, router, userInfo?.user_id]);

    const checkCompanyAfterLogin = async (currentUserId: string) => {
        setCheckCompanyLoading(true);
        setCheckCompanyError(null);
        try {
            const response = await checkComapnyForUser(currentUserId);
            console.log("Company check response:", response);
            if (response?.data?.company_id) {
                console.log("User has a company, fetching company info...");
                const companyResponse = await getCompany(response.data.company_id);
                console.log("Company response:", companyResponse);
                localStorage.setItem("company", JSON.stringify(companyResponse?.data));
                router.push('/dashboard');
            } else {
                console.log("User does not have a company, redirecting to /company");
                router.push('/company');
            }
        } catch (error: any) {
            console.error("Error checking for company:", error);
            setCheckCompanyError("Failed to check for existing company.");
            // Optionally redirect to a neutral page or display an error
            router.push('/company'); // Redirect to company creation as a fallback
        } finally {
            setCheckCompanyLoading(false);
        }
    };

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        try {
            setLoading(true);
            console.log("Form Data:", data);
            await login(data.email, data.password);
            // The redirection logic is now handled in the useEffect after isAuthenticated and userInfo update
        } catch (error: any) {
            console.error("Error during login:", error);
            // Handle login error (e.g., display error message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <div className="flex items-center justify-center px-6 py-20">
                <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl px-10 py-12 border border-gray-200">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#1e293b] mb-8">
                        Login to your Account
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* ... your form input fields ... */}
                        <div>
                            <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                                <FaEnvelope className="text-[#ea580c]" />
                                <input
                                    type="email"
                                    placeholder="Email *"
                                    {...register("email", { 
                                        required: "Email is required",
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: "Please enter a valid email address"
                                        }
                                    })}
                                    className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                                />
                            </label>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                                <FaLock className="text-[#ea580c]" />
                                <input
                                    type="password"
                                    placeholder="Password *"
                                    {...register("password", { 
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters long"
                                        }
                                    })}
                                    className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                                />
                            </label>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || checkCompanyLoading}
                            className="w-full bg-[#ea580c] text-white px-6 py-3 rounded-full font-bold text-lg shadow-md hover:bg-[#d95708] transition disabled:opacity-50"
                        >
                            {loading ? "Logging in..." : (checkCompanyLoading ? "Checking Company..." : "Login")}
                        </button>
                        {checkCompanyError && <p className="text-red-500 text-sm mt-2">{checkCompanyError}</p>}
                    </form>

                    <p className="text-center text-[#4b5563] mt-6 text-sm">
                        Dont't have an account?{" "}
                        <Link href="/auth/RegisterUser" className="text-[#ea580c] font-bold hover:underline transition">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginUser;