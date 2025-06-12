"use client";

import React, { useState, useEffect } from "react";
import NavigationSidebar from "../../components/NavigationSidebar";
import PageHeader from "../../components/PageHeader";
import { useRouter } from "next/navigation";
import { getCompany } from "@/app/api/axiosInstance";
import axios from "axios";

const CATEGORY_OPTIONS = [
  "All",
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
];

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
];

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
  const [dateRange, setDateRange] = useState("last_7_days");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    const localStorageCompany = JSON.parse(localStorage.getItem("company") || "{}");
    setCompanyId(localStorageCompany.id);
    if (localStorageCompany.id) {
      getCompany(localStorageCompany.id).then((res) => setCompanyName(res.data.name));
    }
  }, []);

  const fetchSalesReport = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    setSalesData([]);
    try {
      const payload: any = {
        company_id: companyId,
        date_range: dateRange,
        status,
        category: category === "All" ? "all" : category,
      };
      if (dateRange === "custom") {
        payload.start_date = startDate;
        payload.end_date = endDate;
      }
      const response = await axios.post("/api/report/sales", payload);
      setSalesData(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to fetch sales report.");
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
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
            <select
              className="input-style"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
            <select
              className="input-style"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesData.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">No sales data found for the selected filters.</td>
                </tr>
              )}
              {salesData.map((row) => (
                <tr key={row.invoice_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{row.invoice_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.customer_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <ul className="list-disc ml-4">
                      {row.items.map((item: any, idx: number) => (
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
