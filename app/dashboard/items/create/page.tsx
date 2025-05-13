'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import PageHeader from '../../components/PageHeader';
import NavigationSidebar from '../../components/NavigationSidebar';
import Link from 'next/link';
import { addItem, getAllCustomers } from '@/app/api/axiosInstance';
import { useRouter } from 'next/navigation';


interface ItemFormData {
  name: string;
//   unit: string;
  selling_price: number;
  description?: string;
}



const CreateItemPage = () => {
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
  } = useForm<ItemFormData>({
    defaultValues: {
        name: '',
        // unit: '',
        selling_price: 0,
        description: '',
    },
  });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: 'items',
//   });

  useEffect(() => {
    const localStorageCompany = JSON.parse(localStorage.getItem('company') || '{}');
    setCompanyId(localStorageCompany.id);
  }, []);


  const onSubmit = async (data: ItemFormData) => {
    console.log('Selling Price Type:', typeof data.selling_price);
    try {
        const sellingPriceNumber = parseFloat(data.selling_price as any); // Explicitly convert to number
        if (isNaN(sellingPriceNumber)) {
            alert('Please enter a valid number for the selling price.');
            return;
        }
        const payload = {
            name: data.name,
            // unit: data.unit,
            selling_price: sellingPriceNumber,
            description: data.description,
            company_id: companyId,
        };

      const response = await addItem(payload);
      console.log('item created:', response.data);
      console.log('item created successfully for item id:', response.data.id);
      const newItemId = response.data.id;
      console.log('New Item ID:', newItemId);
      if (newItemId) {
        router.push(`/dashboard/items/${newItemId}`);
      } else {
        console.error('Item created successfully, but no ID received for redirection.');
      }
    } catch (error: any) {
      console.error('Failed to create item:', error);
      alert('Failed to create item. Check console for details.');
    }
  };

//   if (loading) return <div className="p-6 text-lg">Loading customers...</div>;
  if (error) return <div className="p-6 text-red-500 text-lg">Error: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen flex">
      <NavigationSidebar />
      <div className="flex-1 p-6 md:p-10">
        <PageHeader title="Create New Item" />

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-8 space-y-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Item Details</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Item Name</label>
              <input
                type="text"
                {...register('name', { required: true })}
                placeholder="Item Name"
                className="input-style"
              />
            </div>
            
            {/* <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Unit</label>
              <input
                type="text"
                {...register('unit', { required: true })}
                placeholder="Unit"
                className="input-style"
              />
            </div> */}

            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Selling Price</label>
              <input
                type="number"
                // step="0.01"
                {...register('selling_price', { required: true })}
                placeholder="Selling Price"
                className="input-style"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Description</label>
              <textarea {...register('description')} rows={3} className="input-style resize-none" placeholder="description" />
            </div>
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
              Create Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItemPage;
