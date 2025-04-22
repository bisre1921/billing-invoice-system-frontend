'use client';

import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import NavigationSidebar from '../../components/NavigationSidebar';
import { useParams, useRouter } from 'next/navigation';
import { getCompany, getInvoicesByCompany } from '@/app/api/axiosInstance';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeftIcon, EyeIcon } from '@heroicons/react/24/outline';

interface Invoice {
  id: string;
  reference_number: string;
  customer_id: string;
  date: string;
  due_date: string;
  status: string;
  amount: number;
}

const CompanyInvoicesPage = () => {
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
      const localStorageCompany = JSON.parse(localStorage.getItem('company') || '{}');
      setCompanyId(localStorageCompany.company_id);
   }, []);

  useEffect(() => {
    if (companyId) {
      fetchCompanyInvoices(companyId as string);
      fetchCompanyName(companyId as string);
    }
  }, [companyId]);

  const fetchCompanyInvoices = async (companyId: string) => {
    try {
      setLoading(true);
      const response = await getInvoicesByCompany(companyId);
      setInvoices(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching company invoices:', error);
      setError('Failed to load invoices.');
      setLoading(false);
    }
  };

  const fetchCompanyName = async (companyId: string) => {
    try {
        setLoading(true);
        const response = await getCompany(companyId);
        setCompanyName(response.data.name);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching company name:', error);
        setError('Failed to load company name.');
        setLoading(false);
    }
  }


  if (loading) return <div className="p-6 text-lg">Loading invoices...</div>;
  if (error) return <div className="p-6 text-red-500 text-lg">Error: {error}</div>;
  if (!companyId) return <div className="p-6 text-gray-500 text-lg">Company ID not provided.</div>;
  if (invoices?.length == 0) return <div className="p-6 text-gray-500 text-lg">No invoices found for this company.</div>;

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Unpaid':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen flex">
      <NavigationSidebar />
      <div className="flex-1 p-8 xl:p-12">
        <PageHeader title={`${companyName} Company Invoices: `} />

        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
              All Invoices
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 rounded-md shadow-sm">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700 tracking-wider">Reference #</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700 tracking-wider">Issue Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700 tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700 tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-indigo-700 tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-indigo-700 tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices?.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{invoice.reference_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{format(new Date(invoice.date), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{format(new Date(invoice.due_date), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColorClass(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">${invoice.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"> {/* Removed space-x-2 from Link and added to td */}
                      <Link href={`/dashboard/invoices/${invoice.id}`} className="text-indigo-600 hover:text-indigo-800 flex items-center justify-end">
                        <EyeIcon className="w-5 h-5 mr-1" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={5} className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                    Total Invoices:
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-semibold text-indigo-700">{invoices?.length}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <Link
              href="/dashboard"
              className="bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm transition duration-200 flex items-center"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" /> Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInvoicesPage;