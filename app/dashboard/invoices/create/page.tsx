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
  payment_type: 'cash' | 'credit';
  due_date?: string;
  payment_date?: string;
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
  selling_price: number;
}

const CreateInvoicePage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [companyId, setCompanyId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [backendError, setBackendError] = useState('');

  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<InvoiceFormData>({
    defaultValues: {
      payment_type: undefined,
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

  const fetchCustomers = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllCustomers(companyId);
      setCustomers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to load customers.');
      setLoading(false);
    }
  }, [companyId]);

  const fetchItems = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllItems(companyId);
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Failed to load items.');
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    if (companyId) {
      fetchCustomers();
      fetchItems();
    }
  }, [companyId, fetchCustomers, fetchItems]);

  const onSubmit = async (data: InvoiceFormData) => {
    setBackendError('');
    try {
      const payload = {
        reference_number: data.reference_number,
        customer_id: data.customer_id,
        company_id: companyId,
        payment_type: data.payment_type,
        ...(data.payment_type === 'credit' && data.due_date && { due_date: `${data.due_date}T00:00:00Z` }),
        ...(data.payment_date && { payment_date: `${data.payment_date}T00:00:00Z` }),
        terms: data.terms,
        items: data.items.map(item => ({
          item_name: item.item_name,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          discount: Number(item.discount || 0),
        })),
      };
      const response = await generateInvoice(payload);
      const newInvoiceId = response.data.invoice.id;
      if (newInvoiceId) {
        router.push(`/dashboard/invoices/${newInvoiceId}`);
      } else {
        setBackendError('Invoice created successfully, but no ID received for redirection.');
      }
    } catch (error) {
      let errorMessage = 'Failed to create invoice. Check console for details.';
      if (typeof error === 'object' && error && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setBackendError(errorMessage);
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Invoice Details</h2>          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Reference Number</label>
              <input
                type="text"
                {...register('reference_number', { required: true })}
                placeholder="INV-2025-001"
                className="input-style"
              />
              {errors.reference_number && <p className="text-red-500 text-xs mt-1">Reference number is required</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Customer</label>
              <select 
                {...register('customer_id', { required: true })}
                className="input-style"
              >
                <option value="">Select Customer</option>
                {customers?.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              {errors.customer_id && <p className="text-red-500 text-xs mt-1">Customer is required</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Payment Type</label>
              <select 
                {...register('payment_type', { required: true })}
                className="input-style"
              >
                <option value="">Select Payment Type</option>
                <option value="cash">Cash</option>
                <option value="credit">Credit</option>
              </select>
              {errors.payment_type && <p className="text-red-500 text-xs mt-1">Payment type is required</p>}
            </div>

            {watch('payment_type') === 'credit' && (
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Due Date</label>
                <input 
                  type="date" 
                  {...register('due_date', { 
                    required: watch('payment_type') === 'credit' ? 'Due date is required for credit payments' : false 
                  })} 
                  className="input-style" 
                />
                {errors.due_date && <p className="text-red-500 text-xs mt-1">{errors.due_date.message as string}</p>}
              </div>
            )}

            {/* Only show Payment Date if payment type is cash */}
            {watch('payment_type') !== 'credit' && (
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Payment Date (Optional)</label>
                <input type="date" {...register('payment_date')} className="input-style" />
              </div>
            )}

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
                  <select
                    {...register(`items.${index}.item_name`, { required: true })}
                    className="input-style"
                    onChange={e => {
                      const selectedItem = items.find(i => i.name === e.target.value);
                      if (selectedItem) {
                        // Set the unit price for this item
                        const updated = getValues('items');
                        updated[index].unit_price = selectedItem.selling_price || 0;
                        setValue('items', updated);
                      }
                      // Call the original onChange
                      register(`items.${index}.item_name`).onChange(e);
                    }}
                  >
                    <option value="">Select Item Name</option>
                    {items?.map(item => (
                      <option key={item.id} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="number"
                  {...register(`items.${index}.quantity`, { required: true, min: 1 })}
                  placeholder="Qty"
                  className="input-style"
                />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`items.${index}.unit_price`, { required: true })}
                  placeholder="Unit Price"
                  className="input-style"
                />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  {...register(`items.${index}.discount`, {
                    min: { value: 0, message: 'Discount cannot be negative' },
                    max: { value: 100, message: 'Discount cannot exceed 100%' },
                    validate: value => (value === undefined || value === null || value === '' || (!isNaN(value) && value >= 0 && value <= 100)) || 'Discount must be between 0 and 100',
                  })}
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

          {backendError && <div className="text-red-500 text-sm mb-2">{backendError}</div>}
          {/* Show backend error for credit limit exceeded */}
          {typeof backendError === 'string' && backendError.includes("available credit") && (
            <div className="text-red-600 text-sm font-semibold mb-2">{backendError}</div>
          )}

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
