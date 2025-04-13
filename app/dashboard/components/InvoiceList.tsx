import React from 'react';

const InvoiceList = ({ invoices }: { invoices: any[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">ID</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Customer</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Issue Date</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Amount</th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-50 transition duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{invoice.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{invoice.customer}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{invoice.issueDate}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${invoice.amount.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                    invoice.status === 'Draft' ? 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {invoice.status}
                </span>
              </td>
            </tr>
          ))}
          {invoices.length === 0 && (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic" colSpan={5}>No invoices found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;