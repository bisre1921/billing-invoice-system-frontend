'use client';

import React, { useState, useEffect } from 'react';
import NavigationSidebar from '@/app/dashboard/components/NavigationSidebar';
import PageHeader from '@/app/dashboard/components/PageHeader';
import { getBulkItemForecast } from '@/app/api/axiosInstance';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ArrowUpIcon } from '@heroicons/react/24/outline'; // Example icon

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ItemForecast {
    itemId: string;
    itemName: string;
    predictedAverageQuantity: number;
    rmse: number;
}

const AIItemsPredictionPage = () => {
    const [itemPredictions, setItemPredictions] = useState<ItemForecast[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPredictions = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await getBulkItemForecast();
                setItemPredictions(response.data.sort((a, b) => b.predictedAverageQuantity - a.predictedAverageQuantity));
            } catch (err: any) {
                setError('Failed to fetch item predictions.');
                console.error('Error fetching item predictions:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPredictions();
    }, []);

    const top5Predictions = itemPredictions.slice(0, 5);

    const chartData = {
        labels: top5Predictions.map(item => item.itemName),
        datasets: [
            {
                label: 'Predicted Average Quantity',
                data: top5Predictions.map(item => item.predictedAverageQuantity),
                backgroundColor: 'rgba(34, 197, 94, 0.7)', // Tailwind's green-500 with opacity
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Predicted Quantity',
                    color: '#6b7280',
                    font: {
                        weight: 'bold' as const, // Add a valid Chart.js font weight if needed
                    },
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Item Name',
                    color: '#6b7280',
                    font: {
                        weight: 'bold' as const, // Add a valid Chart.js font weight if needed
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Top 5 Predicted Selling Items (Next 30 Days)',
                font: {
                    size: 18,
                    weight: 'bold' as const, // This is a valid Chart.js font weight
                },
                color: '#374151',
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const label = context.dataset.label || '';
                        const value = context.formattedValue || '';
                        return `${label}: ${value}`;
                    },
                },
            },
        },
    };

    if (loading) {
        return <div className="text-gray-600">Loading item predictions...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!itemPredictions || itemPredictions.length === 0) {
        return <div className="text-gray-600">No item predictions available.</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen flex">
            <NavigationSidebar />
            <div className="flex-1 p-6 md:p-10">
                <PageHeader title="Items Prediction" />
                <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 tracking-tight mb-5">
                        Predicted Top Selling Items (Next 30 Days)
                    </h2>
                    <div className="w-full max-w-2xl mx-auto mb-6">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                    {top5Predictions.length > 0 && (
                        <div className="mt-4 p-4 bg-green-50 rounded-md border border-green-200 text-green-700">
                            <p className="font-semibold">Insights:</p>
                            <ul className="list-disc pl-5">
                                {top5Predictions.map((item) => (
                                    <li key={item.itemId}>
                                        <span className="font-medium">{item.itemName}</span> is predicted to have high demand with an average quantity of{' '}
                                        <span className="font-semibold">{item.predictedAverageQuantity.toFixed(2)}</span>. Consider increasing stock levels for this item.
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <p className="text-sm text-gray-500 mt-4">Based on historical sales data for all items.</p>
                </div>
                {itemPredictions.length > 5 && (
                    <div className="mt-6 bg-white rounded-xl shadow-md p-8 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">All Item Predictions</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 shadow-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted Avg. Qty</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RMSE</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {itemPredictions.map((item) => (
                                        <tr key={item.itemId} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.itemId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.itemName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.predictedAverageQuantity.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.rmse.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {itemPredictions.length > 0 && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200 text-blue-700">
                                <p className="text-sm">
                                    <span className="font-semibold">RMSE (Root Mean Squared Error):</span> The RMSE indicates the average magnitude of the errors in the predictions. Lower RMSE values generally suggest more accurate predictions.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIItemsPredictionPage;