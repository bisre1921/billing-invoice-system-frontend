"use client";

import React, { useEffect, useState, useMemo } from "react";
import PageHeader from "../../components/PageHeader";
import NavigationSidebar from "../../components/NavigationSidebar";
import { useParams, useRouter } from "next/navigation";
import { getCompany, getInvoicesByCompany } from "@/app/api/axiosInstance";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeftIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Pagination from "../../components/Pagination";

interface Invoice {
  id: string;
  reference_number: string;
  customer_id: string;
  date: string;
  due_date: string;
  status: string;
  amount: number;
}

const CompanyInvoicesPage = () => {
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const localStorageCompany = JSON.parse(
      localStorage.getItem("company") || "{}"
    );
    setCompanyId(localStorageCompany.id);
  }, []);

  useEffect(() => {
    if (companyId) {
      fetchCompanyInvoices(companyId as string);
      fetchCompanyName(companyId as string);
    }
  }, [companyId]);

  const fetchCompanyInvoices = async (companyId: string) => {
    try {
      setLoading(true);
      const response = await getInvoicesByCompany(companyId);
      setInvoices(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching company invoices:", error);
      setError("Failed to load invoices.");
      setLoading(false);
    }
  };

  const fetchCompanyName = async (companyId: string) => {
    try {
      setLoading(true);
      const response = await getCompany(companyId);
      setCompanyName(response.data.name);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching company name:", error);
      setError("Failed to load company name.");
      setLoading(false);
    }
  };
  const filteredInvoices = useMemo(() => {
    if (!invoices || invoices.length === 0) return [];
    if (!searchTerm) return invoices;
    return invoices.filter(
      (invoice) =>
        invoice.reference_number
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [invoices, searchTerm]);

  const totalPages = Math.ceil(
    (filteredInvoices?.length || 0) / invoicesPerPage
  );
  const paginatedInvoices = useMemo(() => {
    if (!filteredInvoices || filteredInvoices.length === 0) return [];
    const start = (currentPage - 1) * invoicesPerPage;
    const end = start + invoicesPerPage;
    return filteredInvoices.slice(start, end);
  }, [filteredInvoices, currentPage, invoicesPerPage]);
  if (loading) return <div className="p-6 text-lg">Loading invoices...</div>;
  if (error)
    return <div className="p-6 text-red-500 text-lg">Error: {error}</div>;
  if (!companyId)
    return (
      <div className="p-6 text-gray-500 text-lg">Company ID not provided.</div>
    );

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-50 text-green-700 border-green-200";
      case "Unpaid":
        return "bg-red-50 text-red-700 border-red-200";
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen flex">
      <NavigationSidebar />
      <div className="flex-1 p-8 xl:p-12">
        <PageHeader title={`${companyName} Company Invoices: `} />
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-auto max-w-xs">
            <input
              type="text"
              placeholder="Search invoices (reference #, status)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>{" "}
        {invoices?.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <p className="text-gray-700">
              No invoices have been found for this company.
            </p>
            <Link
              href="/dashboard/invoices/create"
              className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition"
            >
              Create Invoice
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
                All Invoices
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 rounded-md shadow-sm">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700 tracking-wider">
                      Reference #
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700 tracking-wider">
                      Issue Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700 tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700 tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-indigo-700 tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-indigo-700 tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedInvoices &&
                    paginatedInvoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="hover:bg-gray-50 transition duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {invoice.reference_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {format(new Date(invoice.date), "MMM d, yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {format(new Date(invoice.due_date), "MMM d, yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColorClass(
                              invoice.status
                            )}`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                          ETB {invoice.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/dashboard/invoices/${invoice.id}`}
                            className="text-indigo-600 hover:text-indigo-800 flex items-center justify-end"
                          >
                            <EyeIcon className="w-5 h-5 mr-1" />
                            <span>View</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-3 text-right text-sm font-semibold text-gray-700"
                    >
                      Total Invoices:
                    </td>
                    <td className="px-6 py-3 text-right text-sm font-semibold text-indigo-700">
                      {invoices?.length}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>{" "}
            {/* Pagination */}
            {filteredInvoices && filteredInvoices.length > 0 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Link
                href="/dashboard"
                className="bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm transition duration-200 flex items-center"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" /> Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyInvoicesPage;
