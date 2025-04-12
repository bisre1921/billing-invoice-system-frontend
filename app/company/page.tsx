"use client"

import { useAppDispatch } from '@/app/store/hooks';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FaAddressBook, FaCalendarAlt, FaEnvelope, FaIndustry, FaLock, FaPhone, FaUser } from 'react-icons/fa';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { CreateCompany } from '../store/slices/CompanySlice';


interface FormData {
    companyName: string;
    companyEmail: string;
    companyAddress: string;
    companyOwner: string;
    companyPhone: string;
    industry: string;
    estabilishedDate: string;
    companySize: string;
}

const CreateCompanyPage = () => {
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch()
    const router = useRouter()
    
    const {userInfo} = useAuth()
    console.log("User Info: ", userInfo)

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<FormData>()


    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        try {
          setLoading(true)
          console.log("Form Data: ", data)
          let processedData: any = {};
          processedData = {
            name: data.companyName,
            email: data.companyEmail,
            address: data.companyAddress,
            owner: data.companyOwner,
            phone: data.companyPhone,
            industry: data.industry,
            estabilished_date: data.estabilishedDate,
            company_size: data.companySize,
          }
          console.log("Processed Data: ", processedData)
          await dispatch(CreateCompany(processedData)).unwrap()
          setLoading(false)
        } catch (error) {
          console.error("Error during registration: ", error)
          setLoading(false)
        }
    }

    return (
      <div className="min-h-screen bg-[#f5f5f5]">
  
      <div className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl px-10 py-12 border border-gray-200">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#1e293b] mb-8">
            Create Your Company
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <div>
              <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                <FaUser className="text-[#ea580c]" />
                <input
                  type="text"
                  placeholder="Name of the Company"
                  {...register("companyName", { required: "Full Name is required" })}
                  className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                />
              </label>
              {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                <FaEnvelope className="text-[#ea580c]" />
                <input
                  type="email"
                  placeholder="Company Email"
                  {...register("companyEmail", { required: "Email is required" })}
                  className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                />
              </label>
              {errors.companyEmail && <p className="text-red-500 text-sm mt-1">{errors.companyEmail.message}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                <FaAddressBook className="text-[#ea580c]" />
                <input
                  type="text"
                  placeholder="Company Address"
                  {...register("companyAddress", { required: "Email is required" })}
                  className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                />
              </label>
              {errors.companyAddress && <p className="text-red-500 text-sm mt-1">{errors.companyAddress.message}</p>}
            </div>

             {/* industry */}
             <div>
              <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                <FaIndustry className="text-[#ea580c]" />
                <input
                  type="text"
                  placeholder="Industry Address"
                  {...register("industry", { required: "Email is required" })}
                  className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                />
              </label>
              {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>}
            </div>

              {/* established date */}
              <div>
              <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                <FaCalendarAlt className="text-[#ea580c]" />
                <input
                  type="text"
                  placeholder="Established date"
                  {...register("estabilishedDate", { required: "Email is required" })}
                  className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                />
              </label>
              {errors.estabilishedDate && <p className="text-red-500 text-sm mt-1">{errors.estabilishedDate.message}</p>}
            </div>

              {/* company size */}
            <div>
              <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                <FaIndustry className="text-[#ea580c]" />
                <input
                  type="text"
                  placeholder="Company Size"
                  {...register("companySize", { required: "Email is required" })}
                  className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                />
              </label>
              {errors.companySize && <p className="text-red-500 text-sm mt-1">{errors.companySize.message}</p>}
            </div>


            {/* Phone */}
            <div>
              <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                <FaPhone className="text-[#ea580c]" />
                <input
                  type="text"
                  placeholder="Company Phone Number"
                  {...register("companyPhone", { required: "Phone Number is required" })}
                  className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                />
              </label>
              {errors.companyPhone && <p className="text-red-500 text-sm mt-1">{errors.companyPhone.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ea580c] text-white px-6 py-3 rounded-full font-bold text-lg shadow-md hover:bg-[#d95708] transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Creat"}
            </button>
          </form>

        </div>
      </div>
    </div>
      );
}

export default CreateCompanyPage