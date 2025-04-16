"use client";

import { getCustomer } from '@/app/api/axiosInstance';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

interface Invoice {
  id: string;
  reference_number: string;
  customer_id: string;
  date: string;
  due_date: string;
  status: string;
  amount: number;
  customerName?: string; // Add an optional customerName property
}

interface InvoiceListProps {
  invoices: Invoice[]; // Expect an array of Invoice objects
}

const InvoiceList = ({ invoices }: InvoiceListProps) => {
  const [invoiceDetails, setInvoiceDetails] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerNames = async () => {
      setLoading(true);
      setError(null);
      try {
        const invoicesWithNames = await Promise.all(
          invoices.map(async (invoice) => {
            try {
              const response = await getCustomer(invoice.customer_id);
              return { ...invoice, customerName: response.data.name };
            } catch (customerError) {
              console.error(`Error fetching customer for invoice ${invoice.id}:`, customerError);
              return { ...invoice, customerName: 'Unknown' }; // Handle errors gracefully
            }
          })
        );
        setInvoiceDetails(invoicesWithNames);
      } catch (error: any) {
        console.error("Error fetching customer details:", error);
        setError("Failed to load customer details.");
      } finally {
        setLoading(false);
      }
    };

    if (invoices && invoices.length > 0) {
      fetchCustomerNames();
    } else {
      setInvoiceDetails([]);
      setLoading(false);
    }
  }, [invoices]);

  if (loading) {
    return <div>Loading recent invoices...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Ref No</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Customer</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Due Date</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Amount</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        {invoiceDetails.map((invoice) => {
    const formattedDate = format(new Date(invoice.due_date), 'MMMM dd, yyyy');

    return (
      <tr key={invoice.id} className="hover:bg-gray-50 transition duration-150">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{invoice.reference_number}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{invoice.customerName}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formattedDate}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${invoice.amount?.toLocaleString()}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
              invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' :
              invoice.status === 'Draft' ? 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {invoice.status}
          </span>
        </td>
      </tr>
    );
  })}

          {invoiceDetails.length === 0 && !loading && !error && (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic" colSpan={5}>No recent invoices found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;