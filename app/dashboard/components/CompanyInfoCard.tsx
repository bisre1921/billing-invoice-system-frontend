import React from 'react';
import { BuildingOfficeIcon, CalendarIcon } from '@heroicons/react/24/solid'; // Using solid icons for more impact

const CompanyInfoCard = ({ company }: { company: any }) => {
  const planColor =
    company.plan === 'Premium' ? 'bg-green-500 text-white' :
    company.plan === 'Basic' ? 'bg-blue-500 text-white' :
    'bg-gray-400 text-white';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="px-6 py-5">
        <h3 className="text-lg font-semibold text-gray-800 tracking-tight mb-4">Company Details</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <BuildingOfficeIcon className="w-5 h-5 mr-3 text-primary-500" />
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Name:</span> {company.name}
            </p>
          </div>
          <div className="flex items-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${planColor}`}>
              {company.plan} Plan
            </span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="w-5 h-5 mr-3 text-primary-500" />
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Created:</span> {new Date(company.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoCard;