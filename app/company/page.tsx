"use client"

import { useAppDispatch } from '@/app/store/hooks';
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
            estabilished_date: String(data.estabilishedDate), 
            company_size: data.companySize,
          }
          console.log("Processed Data: ", processedData)
          await dispatch(CreateCompany(processedData)).unwrap()
          setLoading(false)
          router.push("/dashboard")
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">            <div>
              <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                <FaUser className="text-[#ea580c]" />
                <input
                  type="text"
                  placeholder="Company Name *"
                  {...register("companyName", { 
                    required: "Company Name is required",
                    minLength: {
                      value: 2,
                      message: "Company name must be at least 2 characters long"
                    }
                  })}
                  className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                />
              </label>
              {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
            </div>

            <div>
              <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                <FaEnvelope className="text-[#ea580c]" />
                <input
                  type="email"
                  placeholder="Company Email *"
                  {...register("companyEmail", { 
                    required: "Company Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Please enter a valid email address"
                    }
                  })}
                  className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                />
              </label>
              {errors.companyEmail && <p className="text-red-500 text-sm mt-1">{errors.companyEmail.message}</p>}
            </div>

            <div>
              <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                <FaAddressBook className="text-[#ea580c]" />
                <input
                  type="text"
                  placeholder="Company Address *"
                  {...register("companyAddress", { 
                    required: "Company Address is required",
                    minLength: {
                      value: 5,
                      message: "Address must be at least 5 characters long"
                    }
                  })}
                  className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                />
              </label>
              {errors.companyAddress && <p className="text-red-500 text-sm mt-1">{errors.companyAddress.message}</p>}
            </div>

            <div>
              <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                <FaUser className="text-[#ea580c]" />
                <input
                  type="text"
                  placeholder="Company Owner *"
                  {...register("companyOwner", { 
                    required: "Company Owner is required",
                    minLength: {
                      value: 2,
                      message: "Company owner name must be at least 2 characters long"
                    }
                  })}
                  className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                />
              </label>
              {errors.companyOwner && <p className="text-red-500 text-sm mt-1">{errors.companyOwner.message}</p>}
            </div>

             <div>
              <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                <FaIndustry className="text-[#ea580c]" />
                <input
                  type="text"
                  placeholder="Industry *"
                  {...register("industry", { 
                    required: "Industry is required",
                    minLength: {
                      value: 2,
                      message: "Industry must be at least 2 characters long"
                    }
                  })}
                  className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                />
              </label>
              {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>}
            </div>              <div>
              <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                <FaCalendarAlt className="text-[#ea580c]" />
                <input
                  type="date"
                  placeholder="Established Date *"
                  {...register("estabilishedDate", { 
                    required: "Established Date is required",
                    validate: (value) => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      if (selectedDate > today) {
                        return "Established date cannot be in the future";
                      }
                      return true;
                    }
                  })}
                  className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                />
              </label>
              {errors.estabilishedDate && <p className="text-red-500 text-sm mt-1">{errors.estabilishedDate.message}</p>}
            </div>

            <div>
              <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                <FaIndustry className="text-[#ea580c]" />
                <select
                  {...register("companySize", { 
                    required: "Company Size is required"
                  })}
                  className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                >
                  <option value="">Select Company Size *</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </label>
              {errors.companySize && <p className="text-red-500 text-sm mt-1">{errors.companySize.message}</p>}
            </div>

            <div>
              <label className="flex items-center space-x-3 bg-[#f1f5f9] border border-gray-300 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                <FaPhone className="text-[#ea580c]" />
                <input
                  type="text"
                  placeholder="Company Phone Number *"
                  {...register("companyPhone", { 
                    required: "Phone Number is required",
                    pattern: {
                      value: /^[\+|0]?[1-9][\d]{0,15}$/,
                      message: "Please enter a valid phone number"
                    }
                  })}
                  className="bg-transparent flex-1 outline-none text-[#1e293b] placeholder-gray-500"
                />
              </label>
              {errors.companyPhone && <p className="text-red-500 text-sm mt-1">{errors.companyPhone.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ea580c] text-white px-6 py-3 rounded-full font-bold text-lg shadow-md hover:bg-[#d95708] transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </form>

        </div>
      </div>
    </div>
      );
}

export default CreateCompanyPage