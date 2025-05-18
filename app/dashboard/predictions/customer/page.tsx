'use client';

import React, { useState, useEffect } from 'react';
import NavigationSidebar from '@/app/dashboard/components/NavigationSidebar';
import PageHeader from '@/app/dashboard/components/PageHeader';
import { getAllCustomers, getCustomerItemForecast } from '@/app/api/axiosInstance';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { HeartIcon } from '@heroicons/react/24/outline'; // Example icon

ChartJS.register(ArcElement, Tooltip, Legend);

interface CustomerData {
    id: string;
    name: string;
    email: string;
    // ... other customer properties
}

interface CustomerForecast {
    itemId: string;
    itemName: string;
    predicted_average_Quantity: number;
}

const AICustomerPredictionPage = () => {
    const [customers, setCustomers] = useState<CustomerData[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [customerPredictions, setCustomerPredictions] = useState<CustomerForecast[]>([]);
    const [loadingCustomers, setLoadingCustomers] = useState(true);
    const [loadingPredictions, setLoadingPredictions] = useState(false);
    const [error, setError] = useState('');
    const [companyId, setCompanyId] = useState('');

    useEffect(() => {
        const localStorageCompany = JSON.parse(localStorage.getItem("company") || "{}");
        setCompanyId(localStorageCompany.id);
    }, []);

    useEffect(() => {
        if (companyId) {
            fetchCustomers(companyId);
        }
    }, [companyId]);

    const fetchCustomers = async (companyId: string) => {
        setLoadingCustomers(true);
        setError('');
        try {
            const response = await getAllCustomers(companyId);
            setCustomers(response.data);
        } catch (err: any) {
            setError('Failed to fetch customers.');
            console.error('Error fetching customers:', err);
        } finally {
            setLoadingCustomers(false);
        }
    };

    const fetchCustomerPredictions = async () => {
        if (selectedCustomerId) {
            setLoadingPredictions(true);
            setError('');
            try {
                const response = await getCustomerItemForecast(selectedCustomerId);
                setCustomerPredictions(response.data.slice(0, 5));
            } catch (err: any) {
                if (err.response?.status === 404) {
                    setError('No prediction data available for the selected customer.');
                } else {
                    setError('Failed to fetch predictions for this customer.');
                    console.error('Error fetching customer predictions:', err);
                }
            } finally {
                setLoadingPredictions(false);
            }
        } else {
            setCustomerPredictions([]);
        }
    };

    const handleCustomerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCustomerId(event.target.value);
        setCustomerPredictions([]); // Clear previous predictions
    };

    useEffect(() => {
        fetchCustomerPredictions();
    }, [selectedCustomerId]);

    const chartData = {
        labels: customerPredictions.map(p => p.itemName),
        datasets: [
            {
                label: 'Predicted Quantity',
                data: customerPredictions.map(p => p.predicted_average_Quantity),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: '#6b7280',
                    font: {
                        size: 12,
                        weight: 'normal' as const, // Change to a valid Chart.js font weight
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const label = context.label || '';
                        const value = context.formattedValue || '';
                        return `${label}: ${value}`;
                    },
                },
            },
            title: {
                display: true,
                text: 'Predicted Purchases (Next 30 Days)',
                font: {
                    size: 18,
                    weight: 'bold' as const, // This is a valid Chart.js font weight
                },
                color: '#374151',
            },
        },
    };

    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

    return (
        <div className="bg-gray-100 min-h-screen flex">
            <NavigationSidebar />
            <div className="flex-1 p-6 md:p-10">
                <PageHeader title="Customer Prediction" />

                <div className="mb-6 bg-white rounded-xl shadow-md p-8 border border-gray-200">
                    <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-2">
                        Select a Customer
                    </label>
                    <select
                        id="customer"
                        value={selectedCustomerId}
                        onChange={handleCustomerChange}
                        disabled={loadingCustomers || customers.length === 0}
                        className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">-- Select Customer --</option>
                        {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                                {customer.name}
                            </option>
                        ))}
                    </select>
                    {loadingCustomers && <p className="mt-2 text-sm text-gray-500">Loading customers...</p>}
                    {customers.length === 0 && !loadingCustomers && <p className="mt-2 text-sm text-gray-500">No customers available.</p>}
                </div>

                {selectedCustomerId && selectedCustomer && (
                    <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 tracking-tight mb-5">
                            Predicted Purchases for <span className="font-bold text-indigo-600">{selectedCustomer.name}</span> (Next 30 Days)
                        </h2>
                        {loadingPredictions && <p className="text-sm text-gray-500">Loading predictions...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        {!loadingPredictions && !error && customerPredictions.length > 0 && (
                            <div className="w-full max-w-md mx-auto mb-6">
                                <Pie data={chartData} options={chartOptions} />
                            </div>
                        )}
                        {!loadingPredictions && !error && customerPredictions.length === 0 && (
                            <p className="text-sm text-gray-500">No specific predictions for this customer yet.</p>
                        )}

                        {!loadingPredictions && !error && customerPredictions.length > 0 && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200 text-blue-700">
                                <p className="font-semibold">Customer Insights:</p>
                                <ul className="list-disc pl-5">
                                    {customerPredictions.map((prediction) => (
                                        <li key={prediction.itemId}>
                                            Based on past behavior, <span className="font-medium">{selectedCustomer.name}</span> shows a tendency to purchase{' '}
                                            <span className="font-semibold">{prediction.itemName}</span>. With a predicted average quantity of{' '}
                                            <span className="font-semibold">{prediction.predicted_average_Quantity.toFixed(2)}</span>, consider highlighting this item in your offers to this customer.
                                            {/* You could potentially add more sophisticated logic here to determine "favorite" items based on purchase history */}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AICustomerPredictionPage;