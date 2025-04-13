import React from 'react';
import { CurrencyDollarIcon, ExclamationCircleIcon, UserIcon } from '@heroicons/react/24/solid'; // Using solid icons

const BillingOverview = ({ billing }: { billing: any }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="px-6 py-5">
        <h3 className="text-lg font-semibold text-gray-800 tracking-tight mb-5">Billing Insights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4 p-4 rounded-md bg-blue-50 hover:bg-blue-100 transition duration-200">
            <div className="bg-blue-500 text-white p-3 rounded-md shadow-sm flex-shrink-0">
              <CurrencyDollarIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">This Month Revenue</p>
              <p className="text-xl font-bold text-gray-800">${billing.currentMonthRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 rounded-md bg-yellow-50 hover:bg-yellow-100 transition duration-200">
            <div className="bg-yellow-500 text-white p-3 rounded-md shadow-sm flex-shrink-0">
              <ExclamationCircleIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Outstanding Invoices</p>
              <p className="text-xl font-bold text-gray-800">{billing.outstandingInvoices}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 rounded-md bg-green-50 hover:bg-green-100 transition duration-200">
            <div className="bg-green-500 text-white p-3 rounded-md shadow-sm flex-shrink-0">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Customers</p>
              <p className="text-xl font-bold text-gray-800">{billing.totalCustomers}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingOverview;