'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import PageHeader from '../../components/PageHeader';
import NavigationSidebar from '../../components/NavigationSidebar';
import Link from 'next/link';
import { addItem, getAllCustomers } from '@/app/api/axiosInstance';
import { useRouter } from 'next/navigation';

const ITEM_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Toys & Games',
  'Books',
  'Automotive',
  'Health & Wellness',
  'Grocery'
] as const;

const ITEM_UNITS = [
  'pcs',
  'kg',
  'm',
  'liters',
  'boxes'
] as const;

interface ItemFormData {
  name: string;
  code: string;
  category: string;
  unit: string;
  selling_price: number;
  description?: string;
}

function CreateItemForm() {
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
        code: '',
        category: '',
        unit: '',
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
    console.log('Form Data:', data);
    try {
        const sellingPriceNumber = parseFloat(data.selling_price as any);
        if (isNaN(sellingPriceNumber)) {
            alert('Please enter a valid number for the selling price.');
            return;
        }
        const payload = {
            name: data.name,
            code: data.code,
            category: data.category,
            unit: data.unit,
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
  if (error) return <div className="p-6 text-red-500 text-lg">Error: {error}</div>;  return (
    <div className="bg-gray-50 min-h-screen flex">
      <NavigationSidebar />
      <div className="flex-1 p-6 md:p-10">
        <PageHeader title="Create Item" />
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Item Information</h3>
              <p className="mt-1 text-sm text-gray-600">
                Fill in the details below to create a new item.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {/* Code Field */}
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                    Item Code *
                  </label>
                  <div className="mt-1">
                    <input
                      id="code"
                      type="text"
                      {...register('code', { required: 'Item code is required' })}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter item code"
                    />
                  </div>
                  {errors.code && (
                    <p className="mt-2 text-sm text-red-600">{errors.code.message}</p>
                  )}
                </div>

                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Item Name *
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      type="text"
                      {...register('name', { required: 'Item name is required' })}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter item name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Category Field */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <div className="mt-1">
                    <select
                      id="category"
                      {...register('category', { required: 'Category is required' })}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Select a category</option>
                      {ITEM_CATEGORIES.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                {/* Unit Field */}
                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                    Unit *
                  </label>
                  <div className="mt-1">
                    <select
                      id="unit"
                      {...register('unit', { required: 'Unit is required' })}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Select a unit</option>
                      {ITEM_UNITS.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.unit && (
                    <p className="mt-2 text-sm text-red-600">{errors.unit.message}</p>
                  )}
                </div>

                {/* Selling Price Field */}
                <div className="sm:col-span-1">
                  <label htmlFor="selling_price" className="block text-sm font-medium text-gray-700">
                    Selling Price *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      id="selling_price"
                      type="number"
                      step="0.01"
                      {...register('selling_price', {
                        required: 'Selling price is required',
                        min: { value: 0, message: 'Price must be positive' }
                      })}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md py-2"
                      placeholder="0.00"
                    />
                  </div>
                  {errors.selling_price && (
                    <p className="mt-2 text-sm text-red-600">{errors.selling_price.message}</p>
                  )}
                </div>
              </div>

              {/* Description Field */}
              <div className="mt-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    {...register('description')}
                    rows={4}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter item description (optional)"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-8">
                <div className="flex justify-end space-x-3">
                  <Link
                    href="/dashboard/items"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Item
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateItemForm;
