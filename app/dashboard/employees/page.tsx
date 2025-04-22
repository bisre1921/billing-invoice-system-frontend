'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import NavigationSidebar from '../components/NavigationSidebar';
import Link from 'next/link';
import { getAllEmployees, deleteEmployee as deleteEmployeeApi } from '@/app/api/axiosInstance';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
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
      fetchEmployees();
    }
  }, [companyId]);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllEmployees(companyId);
      setEmployees(response.data);
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      setError('Failed to load employees.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employeeId: string) => {
    router.push(`/dashboard/employees/edit/${employeeId}`);
  };

  const handleDelete = async (employeeId: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setLoading(true);
      setError(null);
      try {
        await deleteEmployeeApi(employeeId);
        fetchEmployees();
        alert('Employee deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting employee:', error);
        setError('Failed to delete employee.');
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
          <PageHeader title="Employees" />
          <div className="text-center py-8">
            <p className="text-lg text-gray-600 animate-pulse">Loading employees...</p>
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
          <PageHeader title="Employees" />
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
        <PageHeader title="Employees" />

        <div className="mb-6">
          <Link
            href="/dashboard/employees/add"
            className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150"
          >
            Add New Employee
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800 tracking-tight">All Employees</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees?.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{employee.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{employee.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(employee.id)}
                        className="text-indigo-600 hover:text-indigo-800 focus:outline-none transition duration-150"
                      >
                        <PencilIcon className="h-5 w-5" />
                        <span className="sr-only">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="text-red-600 hover:text-red-800 focus:outline-none transition duration-150"
                      >
                        <TrashIcon className="h-5 w-5" />
                        <span className="sr-only">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {employees?.length === 0 && !loading && !error && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic" colSpan={5}>
                      No employees found for this company.
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

export default EmployeesPage;