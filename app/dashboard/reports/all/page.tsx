'use client';

import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/NavigationSidebar';
import PageHeader from '../../components/PageHeader';
import Link from 'next/link';
import { getAllReports } from '@/app/api/axiosInstance';
import { DocumentIcon, ExclamationCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface Report {
  id: string;
  company_id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  created_date: string;
  created_by: string;
}

const AllReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllReports();
      setReports(response.data || []);
    } catch (error: unknown) {
      console.error('Failed to fetch reports:', error);
      const errorMessage = error instanceof Error 
        ? error.message
        : 'Failed to load reports. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (err) {
      return 'Invalid date';
    }
  };
  
  const getStatusBadgeStyle = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-600';
    
    switch (status.toLowerCase()) {
      case 'generated':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen flex">
      <NavigationSidebar />
      <div className="flex-1 p-6 md:p-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <PageHeader title="Reports" />
          <div className="flex gap-2">
            <Link
              href="/dashboard/reports/sales"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-150 flex items-center"
            >
              <DocumentIcon className="w-5 h-5 mr-2" />
              Create Sales Report
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <ExclamationCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-medium">Failed to load reports</p>
              <p className="text-red-600 text-sm">{error}</p>
              <button 
                onClick={fetchReports}
                className="mt-2 text-red-700 hover:text-red-800 text-sm font-medium underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading reports...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
            <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
            <p className="text-gray-500 mb-6">Start by generating your first report to track your business insights.</p>
            <Link
              href="/dashboard/reports/sales"
              className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              Get Started
            </Link>
          </div>
        ) : (          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title / Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{report.title || 'Untitled Report'}</div>
                        {report.description && (
                          <div className="text-sm text-gray-500 line-clamp-2">{report.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{report.created_by || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {report.created_date ? 
                            new Date(report.created_date).toLocaleDateString('en-US', {
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric'
                            }) : 'N/A'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          report.status ? 
                            report.status.toLowerCase() === 'generated' ? 'bg-green-100 text-green-800' : 
                            report.status.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-800' : 
                            report.status.toLowerCase() === 'failed' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}>
                          {report.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/dashboard/reports/${report.id}`}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{reports.length}</span> reports
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllReportsPage;