"use client";

import React, { useState, useEffect } from "react";
import NavigationSidebar from "../../components/NavigationSidebar";
import PageHeader from "../../components/PageHeader";
import api, { getCompany } from "@/app/api/axiosInstance";

interface SalesReportItem {
  item_id: string;
  item_name: string;
  category: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface SalesReportData {
  invoice_id: string;
  date: string;
  customer_name: string;
  status: string;
  items: SalesReportItem[];
  total_amount: number;
}

// Define all available categories
const CATEGORY_OPTIONS = [
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Sports & Outdoors",
  "Toys & Games",
  "Books",
  "Automotive",
  "Health & Wellness",
  "Grocery",
  "Office Supplies",
  "Furniture",
];

// Define all available invoice statuses
const STATUS_OPTIONS = [
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
];

// Define date range options
const DATE_RANGE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "last_7_days", label: "Last 7 Days" },
  { value: "last_month", label: "Last Month" },
  { value: "last_3_months", label: "Last 3 Months" },
  { value: "custom", label: "Custom Range" },
];

const SalesReportPage = () => {
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  
  // Filter states
  const [dateRange, setDateRange] = useState("last_7_days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Multiple selection for statuses and categories
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [salesData, setSalesData] = useState<SalesReportData[]>([]);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    const localStorageCompany = JSON.parse(localStorage.getItem("company") || "{}");
    setCompanyId(localStorageCompany.id);
    if (localStorageCompany.id) {
      getCompany(localStorageCompany.id).then((res) => setCompanyName(res.data.name));
    }
  }, []);

  // Toggle status selection
  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const fetchSalesReport = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    setSalesData([]);
    
    try {
      // Build the payload according to the Go controller requirements
      const payload: Record<string, any> = {
        company_id: companyId,
        date_range: dateRange,
      };
      
      // Add date range parameters if custom range is selected
      if (dateRange === "custom") {
        payload.custom_start = startDate;
        payload.custom_end = endDate;
      }
      
      // Add status filters if any are selected
      if (selectedStatuses.length > 0) {
        payload.statuses = selectedStatuses;
      }
      
      // Add category filters if any are selected
      if (selectedCategories.length > 0) {
        payload.categories = selectedCategories;
      }
      
      const response = await api.post("/report/sales", payload);
      setSalesData(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to fetch sales report. Please try again.");
      console.error("Sales report error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex">
      <NavigationSidebar />
      <div className="flex-1 p-6 md:p-10">
        <PageHeader title="Sales Report" />
        <form onSubmit={fetchSalesReport} className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Date Range</label>
            <select
              className="input-style"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              {DATE_RANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          {dateRange === "custom" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
                <input
                  type="date"
                  className="input-style"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
                <input
                  type="date"
                  className="input-style"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
            <button
              type="button"
              className="input-style w-full text-left flex justify-between items-center"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              {selectedStatuses.length === 0 
                ? "Select Statuses" 
                : `${selectedStatuses.length} selected`}
              <span className="ml-2">▼</span>
            </button>
            {showStatusDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                {STATUS_OPTIONS.map((opt) => (
                  <div
                    key={opt.value}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => toggleStatus(opt.value)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(opt.value)}
                      onChange={() => {}}
                      className="mr-2"
                    />
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Categories</label>
            <button
              type="button"
              className="input-style w-full text-left flex justify-between items-center"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              {selectedCategories.length === 0 
                ? "Select Categories" 
                : `${selectedCategories.length} selected`}
              <span className="ml-2">▼</span>
            </button>
            {showCategoryDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {CATEGORY_OPTIONS.map((cat) => (
                  <div
                    key={cat}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => toggleCategory(cat)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => {}}
                      className="mr-2"
                    />
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
            disabled={loading}
          >
            {loading ? "Loading..." : "Generate Report"}
          </button>
        </form>
        {error && <div className="text-red-500 mb-4 font-semibold">{error}</div>}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(!salesData || salesData.length === 0) && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">No sales data found for the selected filters.</td>
                </tr>
              )}
              {salesData?.map((row) => (
                <tr key={row.invoice_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.customer_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <ul className="list-disc ml-4">                      {row.items.map((item: SalesReportItem, idx: number) => (
                        <li key={idx}>
                          <span className="font-semibold">{item.item_name}</span> ({item.category}) - Qty: {item.quantity}, Unit Price: ETB {item.unit_price}, Subtotal: ETB {item.subtotal}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-indigo-700 font-bold">ETB {row.total_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesReportPage;
