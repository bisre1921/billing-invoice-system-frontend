'use client';

import React, { useState, useEffect, useMemo } from 'react';
import NavigationSidebar from '../../components/NavigationSidebar';
import PageHeader from '../../components/PageHeader';
import Link from 'next/link';
import { getAllReportsByCompany } from '@/app/api/axiosInstance'; 
import Pagination from '../../components/Pagination';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;

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

  const filteredReports = useMemo(() => {
    if (!searchTerm) return reports;
    return reports.filter(report =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.created_by.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reports, searchTerm]);

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * reportsPerPage;
    const end = start + reportsPerPage;
    return filteredReports.slice(start, end);
  }, [filteredReports, currentPage, reportsPerPage]);

  if (loading) return <div className="p-6 text-lg">Loading reports...</div>;
  if (error) return <div className="p-6 text-red-500 text-lg">Error: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen flex">
      <NavigationSidebar />
      <div className="flex-1 p-6 md:p-10">
        <PageHeader title="All Reports" />
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-auto max-w-xs">
            <input
              type="text"
              placeholder="Search reports (title, type, status, created by)..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
        {filteredReports.length === 0 ? (
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
                  <th className="px-5 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-5 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created By</th>
                  <th className="px-5 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created Date</th>
                  <th className="px-5 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReports.map((report) => (
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
            {/* Pagination */}
            {filteredReports.length > 0 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllReportsPage;