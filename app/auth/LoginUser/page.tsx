"use client"

import { useAuth } from '@/app/contexts/AuthContext';
import { useAppDispatch } from '@/app/store/hooks';
import Link from 'next/link';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaEnvelope, FaLock } from 'react-icons/fa';

interface FormData {
    email: string;
    password: string;
}

const LoginUser = () => {
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch()

    const {login} = useAuth()

    const {
            register,
            handleSubmit,
            formState: {errors},
            watch,
    } = useForm<FormData>()

     const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
            try {
                setLoading(true)
                console.log("Form Data: ", data)
                let processedData: any = {};
                processedData = {
                    email: data.email,
                    password: data.password
                }
                console.log("Processed Data: ", processedData)
                const response = await login(processedData.email, processedData.password)
                console.log("Login successful")

            } catch (error) {
                console.error("Error during login: ", error)
                setLoading(false)
            } finally {
                setLoading(false)
            }
    }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
  
    <div className="flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl px-10 py-12 border border-gray-200">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#1e293b] mb-8">
          Login to your Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <div>
            <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
              <FaEnvelope className="text-[#ea580c]" />
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
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
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
              />
            </label>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ea580c] text-white px-6 py-3 rounded-full font-bold text-lg shadow-md hover:bg-[#d95708] transition disabled:opacity-50"
          >
            {loading ? "login..." : "login"}
          </button>
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
  )
}

export default LoginUser