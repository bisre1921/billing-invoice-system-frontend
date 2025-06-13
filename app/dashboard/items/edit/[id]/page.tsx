'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import PageHeader from '../../../components/PageHeader';
import NavigationSidebar from '../../../components/NavigationSidebar';
import Link from 'next/link';
import { getItem, updateItem } from '@/app/api/axiosInstance';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

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
  'Grocery',
  'Industrial',
  'Software',
  'Service',
  'Other',
] as const;

const ITEM_UNITS = [
  'pcs', 'kg', 'g', 'mg', 'ton', 
  'm', 'cm', 'mm', 'km',
  'sqm', 'sqft', 
  'liter', 'ml', 
  'gallon', 'oz', 'lb',
  'boxes', 'packs', 'sets', 'reams',
  'hours', 'days', 'months', 'years', 
  'license', 'subscription',
  'Other'
] as const;

interface EditItemFormData {
  name: string;
  code: string;
  category: typeof ITEM_CATEGORIES[number];
  unit: typeof ITEM_UNITS[number];
  selling_price: number;
  description?: string;
}

const EditItemPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [initialDataLoading, setInitialDataLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditItemFormData>();

  useEffect(() => {
    if (id) {
      const fetchItemData = async () => {
        setInitialDataLoading(true);
        setLoading(true);
        try {
          const response = await getItem(id as string);
          const item = response.data;
          // Ensure selling_price is a number
          const numericSellingPrice = parseFloat(item.selling_price);
          reset({
            ...item,
            selling_price: isNaN(numericSellingPrice) ? 0 : numericSellingPrice,
          });
        } catch (error) {
          console.error('Error fetching item data:', error);
          setFormError('Failed to load item data. Please try again.');
        } finally {
          setInitialDataLoading(false);
          setLoading(false);
        }
      };
      fetchItemData();
    }
  }, [id, reset]);

  const onSubmit = async (data: EditItemFormData) => {
    setFormError(null);
    try {
      const sellingPriceNumber = parseFloat(data.selling_price as any);
      if (isNaN(sellingPriceNumber)) {
        setFormError('Selling price must be a valid number.');
        return;
      }
      
      const payload = {
        ...data,
        selling_price: sellingPriceNumber,
      };

      await updateItem(id as string, payload);
      alert('Item updated successfully!');
      router.push(`/dashboard/items/${id}`);
    } catch (error: any) {
      console.error('Error updating item:', error);
      setFormError(error.response?.data?.message || 'Failed to update item. Please try again.');
    }
  };

  if (initialDataLoading || loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex">
        <NavigationSidebar />
        <div className="flex-1 p-6 md:p-10">
          <PageHeader title="Edit Item" />
          <div className="text-center py-8">
            <p className="text-lg text-gray-600 animate-pulse">Loading item data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen flex">
      <NavigationSidebar />
      <div className="flex-1 p-6 md:p-10">
        <PageHeader title="Edit Item" />

        <div className="mb-6">
          <Link
            href={`/dashboard/items/${id}`}
            className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm transition duration-150"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Item Details
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 space-y-6">
          {formError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{formError}</span>
            </div>
          )}

          {/* Item Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...register('name', { required: 'Item name is required' })}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Item Code */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Item Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="code"
              {...register('code', { required: 'Item code is required' })}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              {...register('category', { required: 'Category is required' })}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Category</option>
              {ITEM_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
          </div>

          {/* Unit */}
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
              Unit <span className="text-red-500">*</span>
            </label>
            <select
              id="unit"
              {...register('unit', { required: 'Unit is required' })}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.unit ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Unit</option>
              {ITEM_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            {errors.unit && <p className="mt-1 text-xs text-red-500">{errors.unit.message}</p>}
          </div>

          {/* Selling Price */}
          <div>
            <label htmlFor="selling_price" className="block text-sm font-medium text-gray-700 mb-1">
              Selling Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="selling_price"
              step="0.01"
              {...register('selling_price', { 
                required: 'Selling price is required',
                valueAsNumber: true,
                min: { value: 0, message: 'Selling price cannot be negative' }
              })}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.selling_price ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.selling_price && <p className="mt-1 text-xs text-red-500">{errors.selling_price.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Link
              href={`/dashboard/items/${id}`}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || initialDataLoading}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-150"
            >
              {isSubmitting ? 'Updating...' : 'Update Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemPage;
