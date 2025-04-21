'use client';

import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/NavigationSidebar';
import PageHeader from '../../components/PageHeader';
import { useRouter, useParams } from 'next/navigation';
import { getReport, getUser } from '@/app/api/axiosInstance';
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

interface userInfo {
    user_id: string;
    email: string;
    exp: number;
}

const ReportDetailPage = () => {
    const [report, setReport] = useState<Report | null>(null);
    const [reportLoading, setReportLoading] = useState(true);
    const [reportError, setReportError] = useState('');
    const { id } = useParams();
    const [createrName, setCreaterName] = useState<string>('');

    useEffect(() => {
        if (id) {
            fetchReportDetails(id as string);
        }
    }, [id]);

   

    const fetchReportDetails = async (reportId: string) => {
        setReportLoading(true);
        setReportError('');
        try {
            const response = await getReport(reportId);
            setReport(response.data.report);
        } catch (error: any) {
            console.error('Failed to fetch report details:', error);
            setReportError('Failed to load report details.');
        } finally {
            setReportLoading(false);
        }
    };

   
    if (reportLoading) return <div className="p-6 text-lg text-gray-700">Loading details...</div>;
    if (reportError) return <div className="p-6 text-red-500 text-lg">{reportError}</div>;
    if (!report) return <div className="p-6 text-gray-700">Report not found.</div>;

    return (
        <div className="bg-gray-100 min-h-screen flex">
            <NavigationSidebar />
            <div className="flex-1 p-6 md:p-10">
                <PageHeader title={`Report Details: ${report.title}`} />

                <div className="bg-white rounded-xl shadow-lg p-8 space-y-8 border border-gray-200">
                    <div className="mb-4 border-b border-gray-200 pb-4">
                        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">{report.title}</h2>
                        <p className="mt-2 text-gray-500">{report.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <strong className="text-gray-700 block mb-1">ID:</strong>
                            <p className="text-gray-600">{report.id}</p>
                        </div>
                        <div>
                            <strong className="text-gray-700 block mb-1">Type:</strong>
                            <p className="text-gray-600">{report.type}</p>
                        </div>
                        <div>
                            <strong className="text-gray-700 block mb-1">Status:</strong>
                            <span className={`inline-block px-3 py-1 font-semibold text-sm rounded-full leading-tight ${
                                report.status === 'Generated' ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-700'
                            }`}>
                                {report.status}
                            </span>
                        </div>
                        <div>
                            <strong className="text-gray-700 block mb-1">Created By:</strong>
                            <p className="text-gray-600">{report.created_by}</p>
                        </div>
                        <div>
                            <strong className="text-gray-700 block mb-1">Created Date:</strong>
                            <p className="text-gray-600">{new Date(report.created_date).toLocaleDateString()} {new Date(report.created_date).toLocaleTimeString()}</p>
                        </div>
                        <div>
                            <strong className="text-gray-700 block mb-1">Last Modified:</strong>
                            <p className="text-gray-600">{new Date(report.last_modified_date).toLocaleDateString()} {new Date(report.last_modified_date).toLocaleTimeString()}</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Report Content:</h3>
                        <div className="bg-gray-50 p-4 rounded-md overflow-auto border border-gray-300">
                            <pre className="font-mono text-sm text-gray-700 whitespace-pre-wrap">{report.content}</pre>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-start gap-4">
                        <Link
                            href="/dashboard/reports/all"
                            className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out shadow-sm"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18m-4-4v-2m2-2H5m16 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V11"></path></svg>
                            Back to All Reports
                        </Link>
                        <Link
                            href={`/dashboard/reports/download/${report.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                            Download Report
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDetailPage;