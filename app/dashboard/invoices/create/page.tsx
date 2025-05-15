'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import PageHeader from '../../components/PageHeader';
import NavigationSidebar from '../../components/NavigationSidebar';
import Link from 'next/link';
import { generateInvoice, getAllCustomers, getAllItems } from '@/app/api/axiosInstance';
import { useRouter } from 'next/navigation';

interface InvoiceItem {
  item_name: string;
  quantity: number;
  unit_price: number;
  discount?: number;
  subtotal?: number;
}

interface InvoiceFormData {
  reference_number: string;
  customer_id: string;
  date: string;
  due_date: string;
  payment_date: string;
  status: string;
  terms: string;
  items: InvoiceItem[];
}

interface Customer {
  id: string;
  name: string;
}

interface Item {
  id: string;
  name: string;
}

const CreateInvoicePage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [companyId, setCompanyId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<InvoiceFormData>({
    defaultValues: {
      items: [{ item_name: '', quantity: 1, unit_price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    const localStorageCompany = JSON.parse(localStorage.getItem('company') || '{}');
    setCompanyId(localStorageCompany.id);
  }, []);

  useEffect(() => {
    if (companyId) {
      fetchCustomers();
      fetchItems();
    }
  }, [companyId]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await getAllCustomers(companyId);
      setCustomers(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      setError('Failed to load customers.');
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await getAllItems(companyId);
      console.log("company id: ", companyId);
      console.log('Items:', response.data);
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Failed to load items.');
      setLoading(false);
    }
  }

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      const payload = {
        reference_number: data.reference_number,
        customer_id: data.customer_id,
        company_id: companyId,
        payment_date: data.payment_date ? `${data.payment_date}T00:00:00Z` : "",
        terms: data.terms,
        items: data.items.map(item => ({
          item_name: item.item_name, // Ensure this sends the item ID
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          discount: Number(item.discount || 0),
        })),
      };
      console.log("Payload:", payload);
      const response = await generateInvoice(payload);
      console.log('Invoice created:', response.data);
      const newInvoiceId = response.data.invoice.id;
      if (newInvoiceId) {
        router.push(`/dashboard/invoices/${newInvoiceId}`);
      } else {
        console.error('Invoice created successfully, but no ID received for redirection.');
      }
    } catch (error: any) {
      console.error('Failed to create invoice:', error);
      alert('Failed to create invoice. Check console for details.');
    }
  };
  

  if (loading) return <div className="p-6 text-lg">Loading customers and items...</div>;
  if (error) return <div className="p-6 text-red-500 text-lg">Error: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen flex">
      <NavigationSidebar />
      <div className="flex-1 p-6 md:p-10">
        <PageHeader title="Create New Invoice" />

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-8 space-y-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Invoice Details</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Reference Number</label>
              <input
                type="text"
                {...register('reference_number', { required: true })}
                placeholder="INV-2025-001"
                className="input-style"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Customer</label>
              <select {...register('customer_id', { required: true })} className="input-style">
                <option value="">Select Customer</option>
                {customers?.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            {/* REMOVE Issue Date */}
            {/* <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Issue Date</label>
              <input type="date" {...register('date', { required: true })} className="input-style" />
            </div> */}

            {/* REMOVE Due Date */}
            {/* <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Due Date</label>
              <input type="date" {...register('due_date', { required: true })} className="input-style" />
            </div> */}

            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Payment Date (Optional)</label>
              <input type="date" {...register('payment_date')} className="input-style" />
            </div>

            {/* <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Status</label>
              <select {...register('status', { required: true })} className="input-style">
                <option value="">Select Status</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Pending">Pending</option>
              </select>
            </div> */}

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Terms</label>
              <textarea {...register('terms')} rows={3} className="input-style resize-none" placeholder="Payment terms, conditions, etc." />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Invoice Items</h3>

            {fields.map((field, index) => (
              <div key={field.id} className="grid md:grid-cols-5 gap-4 mb-4 bg-gray-50 p-4 rounded-lg">

                <div>
                  <select {...register(`items.${index}.item_name`, { required: true })} className="input-style">
                    <option value="">Select Item Name</option>
                    {items?.map(item => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* <input
                  {...register(`items.${index}.item_name`, { required: true })}
                  placeholder="Item Name"
                  className="input-style md:col-span-2"
                /> */}

                <input
                  type="number"
                  {...register(`items.${index}.quantity`, { required: true, min: 1 })}
                  placeholder="Qty"
                  className="input-style"
                />
                <input
                  type="number"
                  {...register(`items.${index}.unit_price`, { required: true })}
                  placeholder="Unit Price"
                  className="input-style"
                />
                <input
                  type="number"
                  {...register(`items.${index}.discount`)}
                  placeholder="Discount"
                  className="input-style"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700 font-bold text-sm"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ item_name: '', quantity: 1, unit_price: 0 })}
              className="mt-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded font-semibold transition"
            >
              + Add Item
            </button>
          </div>

          <div className="flex justify-end space-x-3 mt-10">
            <Link
              href="/dashboard"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoicePage;
