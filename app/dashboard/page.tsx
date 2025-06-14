'use client'; 

import React, { useEffect, useState } from 'react';
import NavigationSidebar from './components/NavigationSidebar';
import PageHeader from './components/PageHeader';
import BillingOverview from './components/BillingOverview';
import InvoiceList from './components/InvoiceList';
import QuickActions from './components/QuickActions';
import CompanyInfoCard from './components/CompanyInfoCard';
import Link from 'next/link';
import { getAllCustomers, getCompany, getInvoicesByCompany } from '../api/axiosInstance';
import { ChartBarIcon, SparklesIcon, UserIcon } from '@heroicons/react/24/outline';

interface Invoice {
  id: string;
  reference_number: string;
  customer_id: string;
  date: string;
  due_date: string;
  status: string;
  amount: number;
} 

const DashboardPage = () => {
  const [companyData, setCompanyData] = useState(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customerData, setCustomerData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState("");

  useEffect(() => {
    const localStorageCompany = JSON.parse(localStorage.getItem("company") || "{}");
    console.log("Local Storage Company Data: ", localStorageCompany);
    const companyId = localStorageCompany.id;
    console.log("Company ID: ", companyId);
    setCompanyId(companyId);
  })

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const response = await getCompany(companyId);
      console.log("Company Data: ", response.data);
      setCompanyData(response.data);
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const response = await getAllCustomers(companyId);
      console.log("Customer Data: ", response.data);
      setCustomerData(response.data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setLoading(false);
    }
  }
  

  useEffect(() => {
    if (companyId) {
      fetchCompanyData();
    }
  }, [companyId]);


  useEffect(() => {
    if (companyId) {
      fetchCustomerData();
      fetchCompanyInvoices(companyId);
    }
  }, [companyId]);

  const billingData = {
    currentMonthRevenue: 12500,
    outstandingInvoices: 5,
    totalCustomers: 120,
  };

  const fetchCompanyInvoices = async (companyId: string) => {
      try {
        setLoading(true);
        const response = await getInvoicesByCompany(companyId);
        console.log("invoice response: ", response);
        console.log("invoice response data: ", response.data);
        setInvoices(response.data);
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching company invoices:', error);
        setLoading(false);
      }
  };

  const quickActions = [
    { label: 'Generate Invoice', icon: <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7m14-8v10a7 7 0 01-7 7m0 0l-7-7m7 7V3"></path></svg>, href: '/dashboard/invoices/create' },
    { label: 'Create Item', icon: <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7m14-8v10a7 7 0 01-7 7m0 0l-7-7m7 7V3"></path></svg>, href: '/dashboard/items/create' },
    { label: 'Add EMployee', icon: <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1h9v-1a6 6 0 01-12 0v-1m0 0H9m3.5-6h.01"></path></svg>, href: '/dashboard/employees/add' },
    { label: 'Add Customer', icon: <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1h9v-1a6 6 0 01-12 0v-1m0 0H9m3.5-6h.01"></path></svg>, href: '/dashboard/customers/add' },
    { label: 'Generate Reports', icon: <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>, href: '/dashboard/reports/sales' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <NavigationSidebar />

      <div className="flex-1 p-6 md:p-8 lg:p-10 xl:p-12">
        <PageHeader title="Dashboard" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
          <CompanyInfoCard company={companyData} />
          <BillingOverview invoices={invoices} customers={customerData} />
          <QuickActions actions={quickActions} />
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 flex flex-col justify-center items-center">
                <div className="mb-4">
                    <SparklesIcon className="h-8 w-8 text-indigo-500" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 tracking-tight mb-3">AI Predictive Insights</h2>
                <p className="text-gray-500 text-center mb-4 text-sm">Explore potential future trends for your business.</p>
                <div className="space-y-2 w-full">
                    <Link href="/dashboard/predictions/customer" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md transition duration-150 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 mr-2" />
                        Customer Prediction
                    </Link>
                    <Link href="/dashboard/predictions/items" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-md transition duration-150 flex items-center justify-center">
                        <ChartBarIcon className="h-5 w-5 mr-2" />
                        Items Prediction
                    </Link>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 tracking-tight">Recent Invoices</h2>
                <Link href="/dashboard/invoices/all" className="text-primary-600 hover:text-primary-700 font-medium transition duration-150 text-sm">View All</Link>
              </div>
            </div>
            <InvoiceList invoices={invoices?.slice(0, 5)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;