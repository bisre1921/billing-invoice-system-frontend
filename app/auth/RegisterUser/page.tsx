"use client"

import { useAppDispatch } from '@/app/store/hooks';
import Link from 'next/link';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FaEnvelope, FaLock, FaPhone, FaUser } from 'react-icons/fa';
import { RegisterUser } from '@/app/store/slices/UserAuthSlice';


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

    const {
        register,
        handleSubmit,
        formState: {errors},
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
          await dispatch(RegisterUser(processedData)).unwrap()
          console.log("User Registration Successful")
          setLoading(false)
        } catch (error) {
          console.error("Error during registration: ", error)
          setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9F6F1] text-[#333] px-6 md:px-10 pt-20">
          <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl px-8 py-10 border border-[#B08968]/30">
            <h2 className="text-4xl font-extrabold text-center text-[#B08968] mb-8">
              Register 
            </h2>
    
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="flex items-center space-x-3 bg-[#F1E9DB] border border-[#B08968]/50 rounded-lg px-5 py-3 focus-within:ring-2 focus-within:ring-[#B08968]">
                  <FaUser className="text-[#B08968]" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    {...register("fullName", { required: "Full Name is required" })}
                    className="bg-transparent flex-1 outline-none text-[#333] placeholder-gray-500"
                  />
                </label>
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{String(errors.fullName.message)}</p>}
              </div>
    
              <div>
                <label className="flex items-center space-x-3 bg-[#F1E9DB] border border-[#B08968]/50 rounded-lg px-5 py-3 focus-within:ring-2 focus-within:ring-[#B08968]">
                  <FaEnvelope className="text-[#B08968]" />
                  <input
                    type="email"
                    placeholder="Email"
                    {...register("email", { required: "Email is required" })}
                    className="bg-transparent flex-1 outline-none text-[#333] placeholder-gray-500"
                  />
                </label>
                {errors.email && <p className="text-red-500 text-sm mt-1">{String(errors.email.message)}</p>}
              </div>
    
              <div>
                <label className="flex items-center space-x-3 bg-[#F1E9DB] border border-[#B08968]/50 rounded-lg px-5 py-3 focus-within:ring-2 focus-within:ring-[#B08968]">
                  <FaLock className="text-[#B08968]" />
                  <input
                    type="password"
                    placeholder="Password"
                    {...register("password", { required: "Password is required" })}
                    className="bg-transparent flex-1 outline-none text-[#333] placeholder-gray-500"
                  />
                </label>
                {errors.password && <p className="text-red-500 text-sm mt-1">{String(errors.password.message)}</p>}
              </div>
    
              <div>
                <label className="flex items-center space-x-3 bg-[#F1E9DB] border border-[#B08968]/50 rounded-lg px-5 py-3 focus-within:ring-2 focus-within:ring-[#B08968]">
                  <FaLock className="text-[#B08968]" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                      validate: (value) =>
                        value === password || "Passwords do not match", 
                    })}
                    className="bg-transparent flex-1 outline-none text-[#333] placeholder-gray-500"
                  />
                </label>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{String(errors.confirmPassword.message)}</p>}
              </div>
    
            
    
    
              <div>
                <label className="flex items-center space-x-3 bg-[#F1E9DB] border border-[#B08968]/50 rounded-lg px-5 py-3 focus-within:ring-2 focus-within:ring-[#B08968]">
                  <FaPhone className="text-[#B08968]" />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    {...register("phone", { required: "Phone Number is required" })}
                    className="bg-transparent flex-1 outline-none text-[#333] placeholder-gray-500"
                  />
                </label>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{String(errors.phone.message)}</p>}
              </div>
    
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#B08968] text-black px-6 py-3 rounded-full font-bold text-lg shadow-md hover:bg-[#8E6B50] transition disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
    
            <p className="text-center text-[#333] mt-6">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#B08968] font-bold hover:underline transition">
                Login here
              </Link>
            </p>
          </div>
        </div>
      );
}

export default RegisterUserPage