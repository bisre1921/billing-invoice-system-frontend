'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '../../../components/PageHeader';
import NavigationSidebar from '../../../components/NavigationSidebar';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { getCustomer , updateCustomer } from '@/app/api/axiosInstance';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface EditCustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  tin: string;
  max_credit_amount: number;
}

const EditCustomerPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<EditCustomerFormData>();
  const router = useRouter();
  const { customerId } = useParams();
  const [companyId, setCompanyId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<EditCustomerFormData | null>(null);

  useEffect(() => {
    console.log("customerId:", customerId); 
    const localStorageCompany = JSON.parse(localStorage.getItem('company') || '{}');
    setCompanyId(localStorageCompany.id);
  }, []);

  useEffect(() => {
    if (customerId && companyId) {
      fetchCustomerDetails(customerId as string);
    }
  }, [customerId, companyId]);

  const fetchCustomerDetails = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCustomer(id);
      setCustomerData(response.data);
      reset(response.data); 
    } catch (error: any) {
      console.error('Error fetching customer details:', error);
      setError('Failed to load customer details.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<EditCustomerFormData> = async (data) => {
    if (!customerId || !companyId) {
      setError('Customer ID or Company ID not found.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Ensure max_credit_amount is a number and properly formatted
      const formattedData = {
        ...data,
        company_id: companyId,
        max_credit_amount: Number(data.max_credit_amount),
        tin: data.tin.trim() // Remove any whitespace from TIN
      };

      await updateCustomer(customerId as string, formattedData);
      console.log('Customer updated:', formattedData);
      alert('Customer updated successfully!');
      router.push('/dashboard/customers'); 
    } catch (error: any) {
      console.error('Failed to update customer:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update customer. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex">
        <NavigationSidebar />
        <div className="flex-1 p-8 xl:p-12">
          <PageHeader title="Edit Customer" />
          <div className="text-center py-8">
            <p className="text-lg text-gray-600 animate-pulse">Loading customer details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex">
        <NavigationSidebar />
        <div className="flex-1 p-8 xl:p-12">
          <PageHeader title="Edit Customer" />
          <div className="text-center py-8">
            <p className="text-red-500 font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-100 min-h-screen flex">
      <NavigationSidebar />
      <div className="flex-1 p-8 xl:p-12">
        <PageHeader title="Edit Customer" />

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 tracking-tight">
            <span className="text-orange-600">Edit</span> Customer
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
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2 px-3 leading-tight focus:outline-none ${errors.name ? 'border-red-500' : ''}`}
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
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2 px-3 leading-tight focus:outline-none ${errors.email ? 'border-red-500' : ''}`}
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
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2 px-3 leading-tight focus:outline-none ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="+251 (911) 123-4567"
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
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2 px-3 leading-tight focus:outline-none ${errors.tin ? 'border-red-500' : ''}`}
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
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2 px-3 leading-tight focus:outline-none ${errors.max_credit_amount ? 'border-red-500' : ''}`}
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
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2 px-3 leading-tight focus:outline-none resize-none ${errors.address ? 'border-red-500' : ''}`}
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
                className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-150"
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
                  'Update Customer'
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

export default EditCustomerPage;