import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RevenueData } from '../../../../api/DashboardAPI';

interface RevenueChartProps {
    data: RevenueData[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(value);
    };

    return (
        <div className="bg-white rounded-xl border border-border-subtle shadow-sm p-6 h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-text-main">Revenue Statistics</h3>
                    <p className="text-sm text-text-secondary">Income over the current month</p>
                </div>
                <div className="flex bg-background-light p-1 rounded-lg self-start sm:self-auto">
                    <button className="px-3 py-1 text-xs font-medium rounded-md bg-white text-text-main shadow-sm">This Month</button>
                    <button className="px-3 py-1 text-xs font-medium rounded-md text-text-secondary hover:text-text-main">Last Month</button>
                </div>
            </div>

            <div className="h-64 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#88636f', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#88636f', fontSize: 12 }}
                            tickFormatter={formatCurrency}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5dcdf',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                            labelFormatter={(label) => `Day ${label}`}
                        />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#e6195d"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#e6195d', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6, fill: '#e6195d', strokeWidth: 2, stroke: '#fff' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
