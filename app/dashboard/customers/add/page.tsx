'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import NavigationSidebar from '../../components/NavigationSidebar';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { addCustomer } from '@/app/api/axiosInstance';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface AddCustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  tin: string;
  max_credit_amount: number;
}

const AddCustomerPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddCustomerFormData>();
  const router = useRouter();
  const [companyId, setCompanyId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const localStorageCompany = JSON.parse(localStorage.getItem('company') || '{}');
    setCompanyId(localStorageCompany.id);
  }, []);
  const onSubmit: SubmitHandler<AddCustomerFormData> = async (data) => {
    if (!companyId) {
      setError('Company ID not found. Please ensure you are logged in.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Ensure max_credit_amount is a number and properly formatted
      // Set current_credit_available equal to max_credit_amount initially
      const maxCreditAmount = Number(data.max_credit_amount);
      const formattedData = {
        ...data,
        company_id: companyId,
        max_credit_amount: maxCreditAmount,
        current_credit_available: maxCreditAmount, // Initialize available credit to max limit
        tin: data.tin.trim() // Remove any whitespace from TIN
      };

      const response = await addCustomer(formattedData);
      console.log('Customer added:', response.data);
      alert('Customer added successfully!');
      router.push('/dashboard/customers'); // Redirect to the customers list page
    } catch (error: any) {
      console.error('Failed to add customer:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add customer. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen flex">
      <NavigationSidebar />
      <div className="flex-1 p-8 xl:p-12">
        <PageHeader title="Add New Customer" />

        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 tracking-tight">
            <span className="text-indigo-600">Create</span> Customer
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { required: 'Customer name is required' })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 leading-tight focus:outline-none ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter customer's full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 leading-tight focus:outline-none ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="customer@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 tracking-wide">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register('phone', { required: 'Phone number is required' })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 leading-tight focus:outline-none ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="+251 911 123-4567"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
              </div>

              <div>
                <label htmlFor="tin" className="block text-sm font-semibold text-gray-700 tracking-wide">
                  TIN Number
                </label>
                <input
                  type="text"
                  id="tin"
                  {...register('tin', { required: 'TIN number is required' })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 leading-tight focus:outline-none ${errors.tin ? 'border-red-500' : ''}`}
                  placeholder="Enter TIN number"
                />
                {errors.tin && <p className="mt-1 text-sm text-red-500">{errors.tin.message}</p>}
              </div>

              <div>
                <label htmlFor="max_credit_amount" className="block text-sm font-semibold text-gray-700 tracking-wide">
                  Credit Limit (ETB)
                </label>
                <input
                  type="number"
                  id="max_credit_amount"
                  step="0.01"
                  min="0"
                  {...register('max_credit_amount', { 
                    required: 'Credit limit is required',
                    min: { value: 0, message: 'Credit limit must be positive' },
                    valueAsNumber: true, // Ensures the value is converted to a number
                    validate: value => !isNaN(value) || 'Please enter a valid number'
                  })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 leading-tight focus:outline-none ${errors.max_credit_amount ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                />
                {errors.max_credit_amount && <p className="mt-1 text-sm text-red-500">{errors.max_credit_amount.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 tracking-wide">
                Address
              </label>
              <textarea
                id="address"
                rows={3}
                {...register('address', { required: 'Customer address is required' })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 leading-tight focus:outline-none resize-none ${errors.address ? 'border-red-500' : ''}`}
                placeholder="Customer's street address, city, state, zip"
              />
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
            </div>

            <div className="flex justify-end gap-6">
              <Link
                href="/dashboard/customers"
                className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm transition duration-150"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Customers
              </Link>
              <button
                type="submit"
                className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  'Add Customer'
                )}
              </button>
            </div>

            {error && <div className="mt-4 text-red-500 font-semibold">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerPage;