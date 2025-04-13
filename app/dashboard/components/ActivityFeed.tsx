import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

const ActivityFeed = ({ items }: { items: any[] }) => {
  return (
    <ul className="space-y-3 p-4 sm:p-6">
      {items.map((item) => (
        <li key={item.id} className="bg-white rounded-md shadow-sm border border-gray-100 hover:shadow-md transition duration-200 p-4">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-xs text-gray-600">{item.timestamp}</span>
          </div>
          <p className="text-gray-800 text-sm leading-relaxed">{item.message}</p>
        </li>
      ))}
      {items.length === 0 && (
        <li className="text-gray-500 text-sm italic p-4">No recent activity.</li>
      )}
    </ul>
  );
};

export default ActivityFeed;