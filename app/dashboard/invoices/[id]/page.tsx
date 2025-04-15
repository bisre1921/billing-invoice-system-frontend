'use client';

import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader'; 
import NavigationSidebar from '../../components/NavigationSidebar';
import { useParams } from 'next/navigation';
import { getInvoice } from '@/app/api/axiosInstance';
import Link from 'next/link';

interface Invoice {
  amount: number;
  id: string;
  reference_number: string;
  customer_id: string;
  date: string;
  due_date: string;
  payment_date?: string;
  status: string;
  terms: string;
  items: {
    id: string;
    item_name: string;
    quantity: number;
    unit_price: number;
    discount?: number;
    subtotal: number;
  }[];
  // ... other invoice properties
}

const InvoiceDetailPage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchInvoice(id);
    }
  }, [id]);

  const fetchInvoice = async (invoiceId: string) => {
    try {
      setLoading(true);
      const response = await getInvoice(invoiceId);
      setInvoice(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching invoice:', error);
      setError('Failed to load invoice details.');
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-lg">Loading invoice details...</div>;
  if (error) return <div className="p-6 text-red-500 text-lg">Error: {error}</div>;
  if (!invoice) return <div className="p-6 text-gray-500 text-lg">Invoice not found.</div>;

  const statusColorClass =
    invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
    invoice.status === 'Unpaid' ? 'bg-red-100 text-red-800' :
    invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
    'bg-gray-100 text-gray-800';

  return (
    <div className="bg-gray-100 min-h-screen flex">
      <NavigationSidebar />
      <div className="flex-1 p-6 md:p-10">
        <PageHeader title={`Invoice: ${invoice.reference_number}`} />

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight mb-2">
                Invoice <span className="text-[#565ee0]">{invoice.reference_number}</span>
              </h2>
              <p className="text-sm text-gray-500">Issued on {new Date(invoice.date).toLocaleDateString()}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusColorClass}`}>
              {invoice.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Billing To</h3>
              {/* You might want to fetch customer details based on customer_id */}
              <p className="text-gray-800 font-medium">Customer ID: {invoice.customer_id}</p>
              {/* Add more customer details here if available */}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Invoice Details</h3>
              <p className="text-gray-800"><span className="font-medium">Due Date:</span> {new Date(invoice.due_date).toLocaleDateString()}</p>
              {invoice.payment_date && (
                <p className="text-gray-800"><span className="font-medium">Payment Date:</span> {new Date(invoice.payment_date).toLocaleDateString()}</p>
              )}
              <p className="text-gray-800"><span className="font-medium">Terms:</span> {invoice.terms || 'N/A'}</p>
            </div>
          </div>

          <div className="overflow-x-auto mb-8">
            <table className="min-w-full divide-y divide-gray-200 rounded-md shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 tracking-wider">Item</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 tracking-wider">Qty</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 tracking-wider">Unit Price</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.items.map(item => (
                  <tr key={item.item_name}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.item_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">${item.unit_price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{item.discount ? `${item.discount}%` : '0%'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium text-right">${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={4} className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Total Amount:</td>
                  <td className="px-6 py-3 text-right text-lg font-bold text-[#565ee0]">${invoice.amount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex justify-end mt-8">
            <Link
              href="/dashboard/invoices"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
            >
              Back to Invoices
            </Link>
            {/* Add print or download buttons here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailPage;