import React, { useEffect, useState } from 'react';
import { CurrencyDollarIcon, ExclamationCircleIcon, UserIcon } from '@heroicons/react/24/solid';
import { parseISO, isValid, getMonth, getYear } from 'date-fns';

interface Invoice {
  id: string;
  reference_number: string;
  customer_id: string;
  date: string;
  due_date: string;
  status: string;
  amount: number;
}

const BillingOverview = ({ invoices, customers }: { invoices: Invoice[], customers: any }) => {
  const [paidRevenue, setPaidRevenue] = useState(0);
  const [unpaidRevenue, setUnpaidRevenue] = useState(0);
  const [outstandingInvoicesCount, setOutstandingInvoicesCount] = useState(0);

  useEffect(() => {
    if (invoices && invoices.length > 0) {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let currentMonthPaidRevenue = 0;
      let currentMonthUnpaidRevenue = 0;

      invoices.forEach((invoice) => {
        const parsedDate = parseISO(invoice.date);
        if (isValid(parsedDate) && getMonth(parsedDate) === currentMonth && getYear(parsedDate) === currentYear) {
          if (invoice.status === 'Paid') {
            currentMonthPaidRevenue += invoice.amount;
          } else if (invoice.status === 'Unpaid') {
            currentMonthUnpaidRevenue += invoice.amount;
          }
        }
      });

      setPaidRevenue(currentMonthPaidRevenue);
      setUnpaidRevenue(currentMonthUnpaidRevenue);

      const outstandingCount = invoices.filter(invoice => invoice.amount >= 50000).length;
      setOutstandingInvoicesCount(outstandingCount);
    } else {
      setPaidRevenue(0);
      setUnpaidRevenue(0);
      setOutstandingInvoicesCount(0);
    }
  }, [invoices]);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="px-6 py-5">
        <h3 className="text-lg font-semibold text-gray-800 tracking-tight mb-5">Billing Insights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-md bg-green-50 hover:bg-green-100 transition duration-200">
            <div className="flex items-center space-x-4">
              <div className="bg-green-500 text-white p-3 rounded-md shadow-sm flex-shrink-0">
                <CurrencyDollarIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">This Month Revenue (Paid)</p>
                <p className="text-xl font-bold text-green-700">ETB {paidRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-md bg-orange-50 hover:bg-orange-100 transition duration-200">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-500 text-white p-3 rounded-md shadow-sm flex-shrink-0">
                <CurrencyDollarIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">This Month Revenue (Unpaid)</p>
                <p className="text-xl font-bold text-orange-700">ETB {unpaidRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 rounded-md bg-yellow-50 hover:bg-yellow-100 transition duration-200">
            <div className="bg-yellow-500 text-white p-3 rounded-md shadow-sm flex-shrink-0">
              <ExclamationCircleIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Outstanding Invoices</p>
              <p className="text-xl font-bold text-yellow-700">{outstandingInvoicesCount}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 rounded-md bg-blue-50 hover:bg-blue-100 transition duration-200">
            <div className="bg-blue-500 text-white p-3 rounded-md shadow-sm flex-shrink-0">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Customers</p>
              <p className="text-md font-medium text-blue-700">
                {customers?.length > 0 ? customers.length : 'No customers yet'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingOverview;