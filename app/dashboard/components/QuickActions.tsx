import Link from 'next/link';
import React from 'react';

const QuickActions = ({ actions }: { actions: any[] }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Link key={index} href={action.href} className="bg-primary-100 hover:bg-primary-200 text-primary-700 py-3 px-4 rounded-md flex items-center transition duration-200 shadow-sm">
            {action.icon}
            <span className="font-medium">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;