'use client';

import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import NavigationSidebar from '../../components/NavigationSidebar';
import { useParams } from 'next/navigation';
import { downloadInvoiceApi, getCustomer, getInvoice, sendInvoiceViaEmail } from '@/app/api/axiosInstance';
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
}

interface Customer {
  address: string;
  company_id: string;
  email: string;
  id: string;
  name: string;
  phone: string;
}

const InvoiceDetailPage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) fetchInvoice(id);
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

  useEffect(() => {
    if (invoice) fetchCustomer(invoice.customer_id);
  }, [invoice]);

  const fetchCustomer = async (customerId: string) => {
    try {
      setLoading(true);
      const response = await getCustomer(customerId);
      setCustomer(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customer:', error);
      setError('Failed to load customer details.');
      setLoading(false);
    }
  };

  const downloadInvoice = async () => {
    if (!invoice?.id) {
      console.error('Invoice ID is missing.');
      alert('Could not download invoice. Invoice ID is missing.');
      return;
    }

    try {
      setLoading(true);
      const response = await downloadInvoiceApi(invoice.id); // Use the dedicated downloadInvoiceApi function

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${invoice.reference_number.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setLoading(false);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      setError('Failed to download invoice.');
      setLoading(false);
    }
  };

  const sendEmail = async () => {
    try {
      setLoading(true);
      const response = await sendInvoiceViaEmail(invoice?.id);
      if (response.status === 200) {
        alert(`Invoice sent to ${customer?.email}`);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error sending invoice:', error);
      setError('Failed to send invoice.');
      setLoading(false);
    }
  }

  if (loading) return <div className="p-10 text-xl text-gray-600 animate-pulse">Loading invoice details...</div>;
  if (error) return <div className="p-10 text-red-600 text-lg font-semibold">{error}</div>;
  if (!invoice) return <div className="p-10 text-gray-500 text-lg">Invoice not found.</div>;

  const statusColorClass =
    invoice.status === 'Paid'
      ? 'bg-green-100 text-green-700'
      : invoice.status === 'Unpaid'
      ? 'bg-red-100 text-red-700'
      : invoice.status === 'Pending'
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-gray-200 text-gray-800';

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen flex">
      <NavigationSidebar />
      <div className="flex-1 p-6 md:p-10">
        <PageHeader title={`Invoice: ${invoice.reference_number}`} />

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 transition hover:shadow-2xl duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Invoice <span className="text-[#565ee0]">#{invoice.reference_number}</span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Issued on {new Date(invoice.date).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-4 py-1 rounded-full text-sm font-semibold ${statusColorClass}`}>
              {invoice.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-5 tracking-wide">Billing To</h3>
              <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
                <div>
                  <span className="font-medium text-gray-600">Name:</span> {customer?.name}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Address:</span> {customer?.address}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Email:</span> {customer?.email}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Phone:</span> {customer?.phone}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-5 tracking-wide">Invoice Details</h3>
              <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
                <div>
                  <span className="font-medium text-gray-600">Due Date:</span> {new Date(invoice.due_date).toLocaleDateString()}
                </div>
                {invoice.payment_date && (
                  <div>
                    <span className="font-medium text-gray-600">Payment Date:</span> {new Date(invoice.payment_date).toLocaleDateString()}
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-600">Terms:</span> {invoice.terms || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full text-sm text-left border border-gray-200">
              <thead className="bg-[#f8f8ff] text-gray-700 font-semibold">
                <tr>
                  <th className="px-6 py-3">Item</th>
                  <th className="px-6 py-3 text-right">Qty</th>
                  <th className="px-6 py-3 text-right">Unit Price</th>
                  <th className="px-6 py-3 text-right">Discount</th>
                  <th className="px-6 py-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {invoice.items.map((item) => (
                  <tr key={item.item_name} className="border-t">
                    <td className="px-6 py-4">{item.item_name}</td>
                    <td className="px-6 py-4 text-right">{item.quantity}</td>
                    <td className="px-6 py-4 text-right">${item.unit_price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">{item.discount ?? 0}%</td>
                    <td className="px-6 py-4 text-right font-semibold text-[#565ee0]">${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#f9f9ff] font-bold text-gray-800">
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-right">Total:</td>
                  <td className="px-6 py-4 text-right text-xl text-[#565ee0]">${invoice.amount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center mt-10">
            <div className="flex flex-col md:flex-row justify-start items-center gap-4 mt-10">
              <Link
                  href="/dashboard/invoices"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-lg transition"
                >
                  Back to Invoices
              </Link>
            </div>
            <div className="flex flex-col md:flex-row justify-end items-center gap-4 mt-10">
              <button 
                className="flex items-center gap-2 bg-[#f97316] hover:bg-[#4348be] text-white font-medium px-5 py-2 rounded-lg transition"
                onClick={sendEmail}
              >
                 Send Invoice to {customer?.name}
              </button>
              <button 
                className="flex items-center gap-2 bg-[#565ee0] hover:bg-[#4348be] text-white font-medium px-5 py-2 rounded-lg transition"
                onClick={downloadInvoice}
              >
                Download Invoice
              </button>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailPage;
