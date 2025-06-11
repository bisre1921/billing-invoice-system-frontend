'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageHeader from '../../components/PageHeader';
import NavigationSidebar from '../../components/NavigationSidebar';
import Link from 'next/link';
import { getItem, deleteItem } from '@/app/api/axiosInstance';
import { PencilIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface Item {
  id: string;
  name: string;
  code: string;
  category: string;
  unit: string;
  selling_price: number;
  description?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

const ItemDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchItemDetails();
    }
  }, [id]);

  const fetchItemDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getItem(id as string);
      setItem(response.data);
    } catch (error: any) {
      console.error('Error fetching item details:', error);
      setError('Failed to load item details.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/items/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        await deleteItem(id as string);
        alert('Item deleted successfully!');
        router.push('/dashboard/items');
      } catch (error: any) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item.');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex">
        <NavigationSidebar />
        <div className="flex-1 p-6 md:p-10">
          <PageHeader title="Item Details" />
          <div className="text-center py-8">
            <p className="text-lg text-gray-600 animate-pulse">Loading item details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex">
        <NavigationSidebar />
        <div className="flex-1 p-6 md:p-10">
          <PageHeader title="Item Details" />
          <div className="text-center py-8">
            <p className="text-red-500 font-semibold">{error}</p>
            <Link
              href="/dashboard/items"
              className="inline-flex items-center mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Items
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="bg-gray-50 min-h-screen flex">
        <NavigationSidebar />
        <div className="flex-1 p-6 md:p-10">
          <PageHeader title="Item Details" />
          <div className="text-center py-8">
            <p className="text-gray-600">Item not found.</p>
            <Link
              href="/dashboard/items"
              className="inline-flex items-center mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Items
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <NavigationSidebar />
      <div className="flex-1 p-6 md:p-10">
        <PageHeader title="Item Details" />
        
        <div className="mb-6">
          <Link
            href="/dashboard/items"
            className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm transition duration-150"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Items
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">{item.name}</h1>
                <p className="text-blue-100 mt-1">Code: {item.code}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-md shadow-sm transition duration-150"
                >
                  <PencilIcon className="w-5 h-5 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-150"
                >
                  <TrashIcon className="w-5 h-5 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Item Name:</span>
                    <p className="text-sm text-gray-900 mt-1">{item.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Item Code:</span>
                    <p className="text-sm text-gray-900 mt-1">{item.code}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Category:</span>
                    <p className="text-sm text-gray-900 mt-1">{item.category}</p>
                  </div>
                </div>
              </div>

              {/* Pricing & Unit */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Pricing & Unit</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Unit:</span>
                    <p className="text-sm text-gray-900 mt-1">{item.unit}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Selling Price:</span>
                    <p className="text-lg font-bold text-green-600 mt-1">${item.selling_price.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <div className="bg-gray-50 rounded-lg p-4 md:col-span-2 lg:col-span-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.description}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Record Timestamps</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Created At:</span>
                    <p className="text-sm text-gray-900 mt-1">{new Date(item.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Last Updated:</span>
                    <p className="text-sm text-gray-900 mt-1">{new Date(item.updated_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;