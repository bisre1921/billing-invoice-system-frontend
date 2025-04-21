'use client';

import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/NavigationSidebar';
import PageHeader from '../../components/PageHeader';
import { useRouter, useParams } from 'next/navigation';
import { getReport } from '@/app/api/axiosInstance'; // Assuming you'll create this function
import Link from 'next/link';

interface Report {
  id: string;
  company_id: string;
  title: string;
  description: string;
  created_by: string;
  created_date: string;
  last_modified_date: string;
  type: string;
  status: string;
  content: string;
}

const ReportDetailPage = () => {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchReportDetails(id as string);
    }
  }, [id]);

  const fetchReportDetails = async (reportId: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await getReport(reportId);
      setReport(response.data.report);
    } catch (error: any) {
      console.error('Failed to fetch report details:', error);
      setError('Failed to load report details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-lg">Loading report details...</div>;
  if (error) return <div className="p-6 text-red-500 text-lg">Error: {error}</div>;
  if (!report) return <div className="p-6 text-gray-700">Report not found.</div>;

  return (
    <div className="bg-gray-100 min-h-screen flex">
      <NavigationSidebar />
      <div className="flex-1 p-6 md:p-10">
        <PageHeader title={`Report Details: ${report.title}`} />

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{report.title}</h2>
          <p><strong>ID:</strong> {report.id}</p>
          <p><strong>Type:</strong> {report.type}</p>
          <p><strong>Status:</strong> {report.status}</p>
          <p><strong>Description:</strong> {report.description}</p>
          <p><strong>Created Date:</strong> {new Date(report.created_date).toLocaleString()}</p>
          <p><strong>Last Modified Date:</strong> {new Date(report.last_modified_date).toLocaleString()}</p>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800">Content:</h3>
            <pre className="bg-gray-50 p-4 rounded-md overflow-auto">{report.content}</pre>
          </div>

          <div className="mt-6 flex justify-between">
            <Link href="/dashboard/reports/all" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition">
              Back to All Reports
            </Link>
            <Link href={`/dashboard/reports/download/${report.id}`} target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition">
              Download Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage;