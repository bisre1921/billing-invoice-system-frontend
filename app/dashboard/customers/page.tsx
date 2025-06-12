'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import NavigationSidebar from '../components/NavigationSidebar';
import Link from 'next/link';
import { getAllCustomers, deleteCustomer as deleteCustomerApi } from '@/app/api/axiosInstance';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  tin: string;
  max_credit_amount: number;
  current_credit_available: number;
  created_at: string;
  updated_at: string;
}

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const localStorageCompany = JSON.parse(localStorage.getItem('company') || '{}');
    setCompanyId(localStorageCompany.id);
  }, []);

  useEffect(() => {
    if (companyId) {
      fetchCustomers();
    }
  }, [companyId]);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllCustomers(companyId);
      setCustomers(response.data);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      setError('Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customerId: string) => {
    router.push(`/dashboard/customers/edit/${customerId}`);
  };

  const handleDelete = async (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setLoading(true);
      setError(null);
      try {
        await deleteCustomerApi(customerId);
        // Refresh the customer list after successful deletion
        fetchCustomers();
        alert('Customer deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting customer:', error);
        setError('Failed to delete customer.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex">
        <NavigationSidebar />
        <div className="flex-1 p-6 md:p-10">
          <PageHeader title="Customers" />
          <div className="text-center py-8">
            <p className="text-lg text-gray-600 animate-pulse">Loading customers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex">
        <NavigationSidebar />
        <div className="flex-1 p-6 md:p-10">
          <PageHeader title="Customers" />
          <div className="text-center py-8">
            <p className="text-red-500 font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex">
      <NavigationSidebar />
      <div className="flex-1 p-6 md:p-10">
        <PageHeader title="Customers" />
        <div className="mb-6">
          <Link
            href="/dashboard/customers/add"
            className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150"
          >
            Add New Customer
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800 tracking-tight">All Customers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
                <tr>                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">TIN</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">Credit Limit</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">Available Credit</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-indigo-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers?.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {customer.tin || '-'}
                      </span>
                    </td>                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {typeof customer.max_credit_amount === 'number' 
                          ? new Intl.NumberFormat('en-ET', { 
                              style: 'currency', 
                              currency: 'ETB',
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2 
                            }).format(customer.max_credit_amount)
                          : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${customer.current_credit_available < customer.max_credit_amount * 0.2 ? 'text-red-600' : 'text-green-600'}`}>
                        {typeof customer.current_credit_available === 'number' 
                          ? new Intl.NumberFormat('en-ET', { 
                              style: 'currency', 
                              currency: 'ETB',
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2 
                            }).format(customer.current_credit_available)
                          : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEdit(customer.id)}
                          className="text-indigo-600 hover:text-indigo-800 focus:outline-none transition duration-150"
                        >
                          <PencilIcon className="h-5 w-5" />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="text-red-600 hover:text-red-800 focus:outline-none transition duration-150"
                        >
                          <TrashIcon className="h-5 w-5" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}                {customers?.length === 0 && !loading && !error && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 italic">
                      No customers found for this company.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;