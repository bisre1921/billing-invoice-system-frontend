'use client';

import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/NavigationSidebar';
import PageHeader from '../../components/PageHeader';
import { useParams, useRouter } from 'next/navigation';
import { downloadReportCsv, getReportById, deleteReport } from '@/app/api/axiosInstance';
import Link from 'next/link';

interface ReportItem {
  name: string;
  category: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface InvoiceData {
  invoice_id: string;
  date: string;
  status: string;
  customer_name: string;
  items: ReportItem[];
  total_amount: number;
}

interface Report {
  _id?: string;
  title?: string;
  description?: string;
  created_by?: string;
  created_date?: string;
  last_modified_date?: string;
  type?: string;
  status?: string;
  content?: string;
  company_id?: string;
  // Add any additional fields that might come from the backend
  [key: string]: unknown;
}

// Component to render each invoice card
const InvoiceCard = ({ invoice }: { invoice: InvoiceData }) => {
    const formattedDate = new Date(invoice.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h3 className="font-semibold text-gray-800">Invoice #{invoice.invoice_id.substring(invoice.invoice_id.length - 8)}</h3>
                    <p className="text-sm text-gray-600">{formattedDate}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    invoice.status.toLowerCase() === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {invoice.status}
                </span>
            </div>
            <div className="p-4">
                {invoice.customer_name && (
                    <div className="mb-3">
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-medium">{invoice.customer_name || 'Not specified'}</p>
                    </div>
                )}
                
                <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-2">Items</p>
                    <div className="space-y-2">
                        {invoice.items.map((item, idx) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded-md">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-900">{item.name}</span>
                                    <span className="text-indigo-600 font-semibold">ETB {item.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 mt-1">
                                    <span>{item.quantity} × ETB {item.unit_price.toFixed(2)}</span>
                                    {item.category && <span>Category: {item.category}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Total Amount</span>
                    <span className="text-xl font-bold text-indigo-700">ETB {invoice.total_amount.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

const ReportDetailPage = () => {
    const [report, setReport] = useState<Report | null>(null);
    const [parsedInvoices, setParsedInvoices] = useState<InvoiceData[]>([]);
    const [reportLoading, setReportLoading] = useState(true);
    const [reportError, setReportError] = useState('');
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { id } = useParams();
    const router = useRouter();useEffect(() => {
        if (id) {
            fetchReportDetails(id as string);
        }
    }, [id]);    const fetchReportDetails = async (reportId: string) => {
        setReportLoading(true);
        setReportError('');
        try {
            const response = await getReportById(reportId);
            // The new endpoint directly returns the report object
            setReport(response.data);
            
            // Try to parse the content as JSON if it exists
            if (response.data.content) {
                try {
                    const parsedContent = JSON.parse(response.data.content);
                    if (Array.isArray(parsedContent)) {
                        setParsedInvoices(parsedContent);
                    }
                } catch (parseError) {
                    console.error('Failed to parse report content as JSON:', parseError);
                    // Keep the content as is if it's not valid JSON
                }
            }
        } catch (error: unknown) {
            console.error('Failed to fetch report details:', error);
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Failed to load report details.';
            setReportError(errorMessage);
        } finally {
            setReportLoading(false);
        }
    };const downloadReport = async () => {
       if (!report || !id) {
         console.error('Cannot download report: Report data is missing');
         alert('Could not download report. Report data is missing.');
         return;
       }       try {
         setDownloadLoading(true);
         const response = await downloadReportCsv(id as string); 
   
         const blob = new Blob([response.data], { type: 'text/csv' });
         const url = window.URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         a.download = `report_${report.title?.replace(/\s+/g, '-') || 'untitled'}.csv`;
         document.body.appendChild(a);
         a.click();
         window.URL.revokeObjectURL(url);
         document.body.removeChild(a);
         setDownloadLoading(false);
       } catch (error) {
         console.error('Error downloading report:', error);
         setDownloadLoading(false);
         alert('Failed to download report. Please try again later.');
       }
    };
    
    const deleteReportHandler = async () => {
      if (!id) {
        console.error('Cannot delete report: Report ID is missing');
        return;
      }
      
      try {
        setDeleteLoading(true);
        await deleteReport(id as string);
        // Redirect to all reports page after successful deletion
        router.push('/dashboard/reports/all');
      } catch (error) {
        console.error('Error deleting report:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to delete report.';
        alert(`Failed to delete report: ${errorMessage}`);
      } finally {
        setDeleteLoading(false);
        setShowDeleteConfirm(false);
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

                <div className="bg-white rounded-xl shadow-lg p-8 space-y-8 border border-gray-200">                    <div className="mb-4 border-b border-gray-200 pb-4">
                        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">{report.title}</h2>
                        <p className="mt-2 text-gray-500">{report.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <strong className="text-gray-700 block mb-1">Type:</strong>
                            <p className="text-gray-600">{report.type || 'Not specified'}</p>
                        </div>
                        <div>
                            <strong className="text-gray-700 block mb-1">Status:</strong>
                            <span className={`inline-block px-3 py-1 font-semibold text-sm rounded-full leading-tight ${
                                report.status?.toLowerCase() === 'generated' ? 'bg-green-200 text-green-700' : 
                                report.status?.toLowerCase() === 'processing' ? 'bg-blue-200 text-blue-700' :
                                report.status?.toLowerCase() === 'failed' ? 'bg-red-200 text-red-700' :
                                'bg-gray-200 text-gray-700'
                            }`}>
                                {report.status || 'Unknown'}
                            </span>
                        </div>
                        <div>
                            <strong className="text-gray-700 block mb-1">Created By:</strong>
                            <p className="text-gray-600">{report.created_by || 'Not available'}</p>
                        </div>
                        <div>
                            <strong className="text-gray-700 block mb-1">Created Date:</strong>
                            <p className="text-gray-600">
                                {report.created_date ? 
                                    `${new Date(report.created_date).toLocaleDateString()} ${new Date(report.created_date).toLocaleTimeString()}` : 
                                    'Not available'
                                }
                            </p>
                        </div>
                        {report.last_modified_date && (
                            <div>
                                <strong className="text-gray-700 block mb-1">Last Modified:</strong>
                                <p className="text-gray-600">
                                    {`${new Date(report.last_modified_date).toLocaleDateString()} ${new Date(report.last_modified_date).toLocaleTimeString()}`}
                                </p>
                            </div>                        )}
                    </div>
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Report Content:</h3>
                        
                        {parsedInvoices.length > 0 ? (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h4 className="text-base font-semibold text-gray-700">Invoice Report Summary</h4>
                                        <p className="text-sm text-gray-500">Showing {parsedInvoices.length} invoices</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500">Total Value</div>
                                        <div className="text-xl font-bold text-indigo-700">
                                            ETB {parsedInvoices.reduce((sum, invoice) => sum + invoice.total_amount, 0).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Stats cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <div className="text-sm text-gray-500">Total Invoices</div>
                                        <div className="text-2xl font-bold text-blue-700">{parsedInvoices.length}</div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                        <div className="text-sm text-gray-500">Paid Invoices</div>
                                        <div className="text-2xl font-bold text-green-700">
                                            {parsedInvoices.filter(inv => inv.status.toLowerCase() === 'paid').length}
                                        </div>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                        <div className="text-sm text-gray-500">Unpaid Invoices</div>
                                        <div className="text-2xl font-bold text-yellow-700">
                                            {parsedInvoices.filter(inv => inv.status.toLowerCase() === 'unpaid').length}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Invoice list */}
                                <div>
                                    <h4 className="text-base font-semibold text-gray-700 mb-3">Invoice Details</h4>
                                    <div className="space-y-4">
                                        {parsedInvoices.map((invoice, index) => (
                                            <InvoiceCard key={invoice.invoice_id || index} invoice={invoice} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-md overflow-auto border border-gray-300">
                                {report.content ? (
                                    <pre className="font-mono text-sm text-gray-700 whitespace-pre-wrap">{report.content}</pre>
                                ) : (
                                    <div className="text-gray-500 italic">No content available for this report.</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-start gap-4">
                        <Link
                            href="/dashboard/reports/all"
                            className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out shadow-sm"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18m-4-4v-2m2-2H5m16 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V11"></path></svg>
                            Back to All Reports
                        </Link>                        <button 
                            className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out" 
                            onClick={downloadReport}
                            disabled={downloadLoading}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                            {downloadLoading ? "Downloading..." : "Download CSV Report"}
                        </button>
                        <button
                            className="inline-flex items-center bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            Delete Report
                        </button>
                    </div>

                    {showDeleteConfirm && (
                        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                            <p className="font-semibold">Confirm Deletion</p>
                            <p className="text-sm">Are you sure you want to delete this report? This action cannot be undone.</p>
                            <div className="mt-4 flex gap-2">
                                <button
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out"
                                    onClick={deleteReportHandler}
                                    disabled={deleteLoading}
                                >
                                    {deleteLoading ? 'Deleting...' : 'Yes, Delete Report'}
                                </button>
                                <button
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportDetailPage;