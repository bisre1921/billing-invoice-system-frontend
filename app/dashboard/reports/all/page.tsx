'use client';

import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/NavigationSidebar';
import PageHeader from '../../components/PageHeader';
import Link from 'next/link';
import { getAllReportsByCompany } from '@/app/api/axiosInstance'; 

interface Report {
  id: string;
  title: string;
  type: string;
  status: string;
  created_date: string;
  created_by: string;
}

const AllReportsPage = () => {
  const [companyId, setCompanyId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const localStorageCompany = JSON.parse(localStorage.getItem('company') || '{}');
    setCompanyId(localStorageCompany.id);
  }, []);

  useEffect(() => {
    if (companyId) {
      fetchReports();
    }
  }, [companyId]);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllReportsByCompany(companyId);
      setReports(response.data);
    } catch (error: any) {
      console.error('Failed to fetch reports:', error);
      setError('Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-lg">Loading reports...</div>;
  if (error) return <div className="p-6 text-red-500 text-lg">Error: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen flex">
      <NavigationSidebar />
      <div className="flex-1 p-6 md:p-10">
        <PageHeader title="All Reports" />

        {reports?.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <p className="text-gray-700">No reports have been generated yet.</p>
            <Link href="/dashboard/reports" className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition">
              Generate New Report
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-x-auto border border-gray-200">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-5 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-5 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-5 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-5 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports?.map((report) => (
                  <tr key={report.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{report.title}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{report.type}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className={`relative inline-block px-3 py-1 font-semibold text-xs rounded-full leading-tight ${
                        report.status === 'Generated' ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{report.created_by}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{new Date(report.created_date).toLocaleDateString()}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <Link href={`/dashboard/reports/${report.id}`} className="text-indigo-600 hover:text-indigo-800 mr-2">
                        View Details
                      </Link>
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

export default AllReportsPage;