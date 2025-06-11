'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PageHeader from '../components/PageHeader';
import NavigationSidebar from '../components/NavigationSidebar';
import { getAllItems } from '@/app/api/axiosInstance';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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

const ItemsListPage = () => {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const companyData = localStorage.getItem('company');
    if (companyData) {
      const parsedCompany = JSON.parse(companyData);
      setCompanyId(parsedCompany.id);
    }
  }, []);

  useEffect(() => {
    if (companyId) {
      fetchItems();
    }
  }, [companyId]);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllItems(companyId!);
      setItems(response.data || []);
    } catch (err: any) {
      console.error('Error fetching items:', err);
      setError('Failed to load items. Please ensure you have a registered company and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewItem = (itemId: string) => {
    router.push(`/dashboard/items/${itemId}`);
  };

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <NavigationSidebar />
      <div className="flex-1 p-6 md:p-10">
        <PageHeader title="Items Management" />

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-auto max-w-xs">
            <input 
              type="text"
              placeholder="Search items (name, code, category)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <Link
            href="/dashboard/items/create"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-150 w-full sm:w-auto"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Item
          </Link>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600 animate-pulse">Loading items...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md my-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            {companyId === null && 
              <p className="mt-2">It seems you are not associated with a company. Please <Link href="/company" className="text-blue-600 hover:underline">register or select your company</Link> to manage items.</p>
            }
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No items found. {searchTerm ? 'Try adjusting your search.' : 'Get started by adding a new item.'}</p>
          </div>
        )}

        {!loading && !error && filteredItems.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.selling_price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewItem(item.id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-blue-100"
                          title="View Item"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <Link
                          href={`/dashboard/items/edit/${item.id}`}
                          className="text-yellow-600 hover:text-yellow-800 transition-colors p-1 rounded-full hover:bg-yellow-100"
                          title="Edit Item"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </Link>
                        {/* Delete button can be added here if needed, similar to other pages */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemsListPage;
