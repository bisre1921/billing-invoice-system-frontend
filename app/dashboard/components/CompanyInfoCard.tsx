import React, { useEffect, useState } from 'react';
import { BuildingOfficeIcon, CalendarIcon } from '@heroicons/react/24/solid'; // Using solid icons for more impact
import { getUser } from '@/app/api/axiosInstance';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';

const CompanyInfoCard = ({ company }: { company: any }) => {
  const [companyOwner, setCompanyOwner] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCompanyOwner = async () => {
    try {
      setLoading(true);
      const response = await getUser(company?.owner);
      console.log("Company Owner Data: ", response.data);
      console.log("Company Owner name: ", response.data.user.name);
      setCompanyOwner(response.data.user.name);
      console.log("Company Owner: ", companyOwner);
    } catch (error) {
      console.error("Error fetching company owner data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (company?.owner) {
      fetchCompanyOwner();
    }
  }
  , [company?.owner]);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="px-6 py-5">
        <h3 className="text-lg font-semibold text-gray-800 tracking-tight mb-4">Company Details</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <BuildingOfficeIcon className="w-5 h-5 mr-3 text-[#6366f1]" />
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Name:</span> {company?.name}
            </p>
          </div>
          <div className="flex items-center">
            <BuildingStorefrontIcon className="w-5 h-5 mr-3 text-[#6366f1]" />
            <span className={`inline-flex bg-green-500 text-white items-center px-3 py-3 rounded-md text-xs font-semibold`}>
              {companyOwner ? (
                <p className="text-sm ">
                  <span className="font-medium">Owner:</span> {companyOwner}
                </p>
              ) : (
                <p className="text-sm">
                  <span className="font-medium">Owner:</span> Loading...
                </p>
              )}
            </span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="w-5 h-5 mr-3 text-[#6366f1]" />
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Address:</span> {company?.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoCard;