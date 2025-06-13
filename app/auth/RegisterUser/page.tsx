"use client"

import { useAppDispatch } from '@/app/store/hooks';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FaEnvelope, FaLock, FaPhone, FaUser } from 'react-icons/fa';
import { RegisterUser } from '@/app/store/slices/UserAuthSlice';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface FormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
}

const RegisterUserPage = () => {
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { login, isAuthenticated } = useAuth();
    const [invitationToken, setInvitationToken] = useState<string | null>(null);
    const [companyIdFromToken, setCompanyIdFromToken] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            console.log("User is already authenticated");
            router.push('/dashboard');
            return;
        }
        // Get the token and companyId from the URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const companyId = token
        console.log("Invitation Token: ", token);
        console.log("Company ID from URL: ", companyId);
        setInvitationToken(token);
        setCompanyIdFromToken(companyId);
    }, [isAuthenticated, router]);



    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<FormData>()
    const password = watch("password")

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        try {
            setLoading(true)
            console.log("Form Data: ", data)
            let processedData: any = {};
            processedData = {
                name: data.fullName,
                email: data.email,
                password: data.password,
                phone: data.phone,
            }
            console.log("Processed Data: ", processedData)
            // Pass the token along with the registration data
            const response: any = await dispatch(RegisterUser({ ...processedData, token: invitationToken })).unwrap()

            console.log("User Registration Successful", response)
            setLoading(false)

            console.log("Invitation Token: ", invitationToken)
            console.log("Company ID from Token:", companyIdFromToken);

            console.log("user data: ", data)
            console.log("user email: ", data.email)
            console.log("user password: ", data.password)
            if (invitationToken && companyIdFromToken) {
                toast.success("Successfully Registered and Verified Invitation");
                await login(data.email, data.password);

                localStorage.setItem('company', JSON.stringify({ id: companyIdFromToken })); // Store company ID
                router.push(`/dashboard`);

            } else {
                toast.success("Successfully Registered");
                router.replace('/auth/LoginUser');
            }        } catch (error: any) {
            console.error("Error during registration: ", error)
            
            // Handle specific error messages from backend
            let errorMessage = "An error occurred during registration";
            
            if (error?.message) {
                errorMessage = error.message;
            } else if (error?.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            // Show specific error message to user
            toast.error(errorMessage);
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5]">

            <div className="flex items-center justify-center px-6 py-20">
                <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl px-10 py-12 border border-gray-200">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#1e293b] mb-8">
                        Create Your Account
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">                        {/* Full Name */}
                        <div>
                            <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                                <FaUser className="text-[#ea580c]" />
                                <input
                                    type="text"
                                    placeholder="Full Name *"
                                    {...register("fullName", { 
                                        required: "Full Name is required",
                                        minLength: {
                                            value: 2,
                                            message: "Full name must be at least 2 characters long"
                                        }
                                    })}
                                    className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                                />
                            </label>
                            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                        </div>

                        {/* Email */}
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

                        {/* Password */}
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
                                        },
                                    })}
                                    className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                                />
                            </label>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                                <FaLock className="text-[#ea580c]" />
                                <input
                                    type="password"
                                    placeholder="Confirm Password *"
                                    {...register("confirmPassword", {
                                        required: "Confirm Password is required",
                                        validate: (value) => value === password || "Passwords do not match"
                                    })}
                                    className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                                />
                            </label>
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                                <FaPhone className="text-[#ea580c]" />
                                <input
                                    type="text"
                                    placeholder="Phone Number *"
                                    {...register("phone", { 
                                        required: "Phone Number is required",
                                        pattern: {
                                            value: /^[\+|0]?[1-9][\d]{0,15}$/,
                                            message: "Please enter a valid phone number"
                                        }
                                    })}
                                    className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                                />
                            </label>
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#ea580c] text-white px-6 py-3 rounded-full font-bold text-lg shadow-md hover:bg-[#d95708] transition disabled:opacity-50"
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>

                    <p className="text-center text-[#4b5563] mt-6 text-sm">
                        Already have an account?{" "}
                        <Link href="/auth/LoginUser" className="text-[#ea580c] font-bold hover:underline transition">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterUserPage