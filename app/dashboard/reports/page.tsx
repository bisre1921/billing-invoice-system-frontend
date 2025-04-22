'use client';

import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../components/NavigationSidebar';
import PageHeader from '../components/PageHeader';
import { useRouter } from 'next/navigation';
import { generateReport, getUser } from '@/app/api/axiosInstance';
import Link from 'next/link';

interface ReportFormData {
  company_id: string;
  title: string;
  description: string;
  content: string;
  type: string;
  created_by: string;
}

interface userInfo {
  user_id: string;
  email: string;
  exp: number;
}

const GenerateReportPage = () => {
    const [companyId, setCompanyId] = useState('');
    const [userInfo, setUserInfo] = useState<userInfo>({ user_id: '', email: '', exp: 0 });
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(true);
    const [error, setError] = useState('');
    const [userError, setUserError] = useState('');
    const router = useRouter();
    const [reportOptions, setReportOptions] = useState([
        { value: 'Financial', label: 'Financial Report' },
        { value: 'Inventory', label: 'Inventory Report' },
        { value: 'Customer Analysis', label: 'Customer Analysis Report' },
    ]);
    const [generatedReport, setGeneratedReport] = useState<any>(null);
    const [createrName, setCreaterName] = useState<string>('');

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            setUserInfo(parsedUserInfo);
        }
    }, []);

    useEffect(() => {
        if (userInfo.user_id) {
            fetchCurrentUser();
        } else {
            setUserLoading(false); 
        }
    }, [userInfo.user_id]);

    const fetchCurrentUser = async () => {
        setUserLoading(true);
        setUserError('');
        try {
            const response = await getUser(userInfo.user_id);
            console.log("Current User Data: ", response.data);
            setCreaterName(response.data.user.name);
            console.log("Creater Name: ", response.data.user.name);
        } catch (error: any) {
            console.error("Error fetching user data:", error);
            setUserError('Failed to fetch user information.');
        } finally {
            setUserLoading(false);
        }
    };

    useEffect(() => {
        const localStorageCompany = JSON.parse(localStorage.getItem('company') || '{}');
        setCompanyId(localStorageCompany.id);
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setGeneratedReport(null);

        const formData = new FormData(event.currentTarget);
        const reportData: ReportFormData = {
            company_id: companyId,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            content: formData.get('content') as string,
            type: formData.get('type') as string,
            created_by: createrName,
        };

        try {
            const response = await generateReport(reportData);
            console.log('Report generated:', response.data);
            setGeneratedReport(response.data);
            alert('Report generated successfully!');
            router.push('/dashboard/reports/all');
        } catch (error: any) {
            console.error('Failed to generate report:', error);
            setError('Failed to generate report. Please check the console for details.');
        } finally {
            setLoading(false);
        }
    };

    if (userLoading) return <div className="p-6 text-lg">Loading user information...</div>;
    if (userError) return <div className="p-6 text-red-500 text-lg">{userError}</div>;


  return (
    <div className="bg-gray-100 min-h-screen flex">
      <NavigationSidebar />
      <div className="flex-1 p-6 md:p-10">
        <PageHeader title="Generate New Report" />

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Report Details</h2>

          {error && <div className="text-red-500">{error}</div>}

          <div>
            <label htmlFor="type" className="text-sm font-semibold text-gray-600 mb-1 block">Report Type</label>
            <select
              id="type"
              name="type"
              className="input-style"
              required
            >
              <option value="">Select Report Type</option>
              {reportOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="text-sm font-semibold text-gray-600 mb-1 block">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="input-style"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-semibold text-gray-600 mb-1 block">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="input-style resize-none"
              placeholder="Enter report description"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="text-sm font-semibold text-gray-600 mb-1 block">Full Content</label>
            <textarea
              id="content"
              name="content"
              rows={6}
              className="input-style resize-none"
              placeholder="Enter full report content"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <Link
              href="/dashboard/reports/all"
              className="bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold py-2 px-6 rounded-lg transition"
            >
                View All Reports
            </Link>
            <div className="flex justify-end space-x-3 mt-8">
                <Link
                href="/dashboard"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition"
                >
                Cancel
                </Link>
                <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition"
                disabled={loading}
                >
                {loading ? 'Generating...' : 'Generate Report'}
                </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

export default GenerateReportPage;