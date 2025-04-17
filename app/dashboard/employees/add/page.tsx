'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import NavigationSidebar from '../../components/NavigationSidebar';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { addEmployee } from '@/app/api/axiosInstance';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface AddEmployeeFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  position?: string;
}

const AddEmployeePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddEmployeeFormData>();
  const router = useRouter();
  const [companyId, setCompanyId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const localStorageCompany = JSON.parse(localStorage.getItem('company') || '{}');
    setCompanyId(localStorageCompany.company_id);
  }, []);

  const onSubmit: SubmitHandler<AddEmployeeFormData> = async (data) => {
    if (!companyId) {
      setError('Company ID not found. Please ensure you are logged in.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await addEmployee({ ...data, company_id: companyId });
      console.log('Employee added:', response.data);
      alert('Employee added successfully!');
      router.push('/dashboard/employees'); 
    } catch (error: any) {
      console.error('Failed to add employee:', error);
      setError('Failed to add employee. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen flex">
      <NavigationSidebar />
      <div className="flex-1 p-8 xl:p-12">
        <PageHeader title="Add New Employee" />

        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 tracking-tight">
            <span className="text-indigo-600">Create</span> Employee
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Employee name is required' })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 leading-tight focus:outline-none ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter employee's full name"
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
                placeholder="employee@example.com"
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
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 tracking-wide">
                Address
              </label>
              <textarea
                id="address"
                rows={3}
                {...register('address', { required: 'employee address is required' })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 leading-tight focus:outline-none resize-none ${errors.address ? 'border-red-500' : ''}`}
                placeholder="employee's street address, city, state, zip"
              />
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 tracking-wide">
                Position
              </label>
              <textarea
                id="position"
                rows={3}
                {...register('position', { required: 'employee position is required' })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 leading-tight focus:outline-none resize-none ${errors.address ? 'border-red-500' : ''}`}
                placeholder="employee's position, manager, owner, marketing, etc."
              />
              {errors.position && <p className="mt-1 text-sm text-red-500">{errors.position.message}</p>}
            </div>

            <div className="flex justify-end gap-6">
              <Link
                href="/dashboard/employees"
                className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm transition duration-150"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Employees
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
                  'Add Employee'
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

export default AddEmployeePage;