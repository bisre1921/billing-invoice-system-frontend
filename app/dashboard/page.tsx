'use client'; // This is a client-side component

import React from 'react';
import NavigationSidebar from './components/NavigationSidebar';
import PageHeader from './components/PageHeader';
import BillingOverview from './components/BillingOverview';
import InvoiceList from './components/InvoiceList';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import CompanyInfoCard from './components/CompanyInfoCard';
import Link from 'next/link';

const DashboardPage = () => {
  const companyData = {
    name: 'Acme Corporation',
    plan: 'Premium',
    createdAt: '2024-03-15',
  };

  const billingData = {
    currentMonthRevenue: 12500,
    outstandingInvoices: 5,
    totalCustomers: 120,
  };

  const invoices = [
    { id: 'INV-2025-001', customer: 'Beta Industries', issueDate: '2025-04-05', amount: 550, status: 'Paid' },
    { id: 'INV-2025-002', customer: 'Gamma Solutions', issueDate: '2025-04-08', amount: 1200, status: 'Pending' },
    { id: 'INV-2025-003', customer: 'Delta Corp', issueDate: '2025-04-10', amount: 875, status: 'Paid' },
    { id: 'INV-2025-004', customer: 'Epsilon Ltd', issueDate: '2025-04-12', amount: 320, status: 'Overdue' },
    { id: 'INV-2025-005', customer: 'Zeta Systems', issueDate: '2025-04-15', amount: 980, status: 'Draft' },
    { id: 'INV-2025-006', customer: 'Theta Group', issueDate: '2025-04-18', amount: 1500, status: 'Paid' },
  ];

  const activityItems = [
    { id: 1, type: 'invoice_sent', message: 'Invoice INV-2025-001 sent to Beta Industries.', timestamp: '5 minutes ago' },
    { id: 2, type: 'payment_received', message: 'Payment of $550 received from Beta Industries.', timestamp: '15 minutes ago' },
    { id: 3, type: 'new_customer', message: 'New customer "Epsilon Ltd." registered.', timestamp: '30 minutes ago' },
    { id: 4, type: 'invoice_updated', message: 'Invoice INV-2025-002 updated.', timestamp: '1 hour ago' },
    { id: 5, type: 'payment_failed', message: 'Payment for INV-2025-003 failed.', timestamp: '2 hours ago' },
  ];

  const quickActions = [
    { label: 'Create Invoice', icon: <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7m14-8v10a7 7 0 01-7 7m0 0l-7-7m7 7V3"></path></svg>, href: '/dashboard/invoices/create' },
    { label: 'Add Customer', icon: <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1h9v-1a6 6 0 01-12 0v-1m0 0H9m3.5-6h.01"></path></svg>, href: '/dashboard/customers/add' },
    { label: 'View Reports', icon: <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>, href: '/dashboard/reports' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <NavigationSidebar />

      <div className="flex-1 p-6 md:p-8 lg:p-10 xl:p-12">
        <PageHeader title="Dashboard" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
          <CompanyInfoCard company={companyData} />
          <BillingOverview billing={billingData} />
          <QuickActions actions={quickActions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 tracking-tight">Recent Invoices</h2>
                <Link href="/dashboard/invoices" className="text-primary-600 hover:text-primary-700 font-medium transition duration-150 text-sm">View All</Link>
              </div>
            </div>
            <InvoiceList invoices={invoices.slice(0, 5)} /> {/* Show a limited number */}
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800 tracking-tight">Activity Feed</h2>
            </div>
            <ActivityFeed items={activityItems.slice(0, 5)} /> {/* Show a limited number */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;