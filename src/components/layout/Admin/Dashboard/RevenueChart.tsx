import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RevenueData, RevenuePeriod } from '../../../../api/DashboardAPI';

interface RevenueChartProps {
    data: RevenueData[];
    period: RevenuePeriod;
    onPeriodChange: (period: RevenuePeriod) => void;
}

export default function RevenueChart({ data, period, onPeriodChange }: RevenueChartProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(value);
    };

    return (
        <div className="bg-white rounded-xl border border-border-subtle shadow-sm p-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 flex-shrink-0">
                <div>
                    <h3 className="text-lg font-bold text-text-main">Revenue Statistics</h3>
                    <p className="text-sm text-text-secondary">Income over time</p>
                </div>
                <div className="flex bg-background-light p-1 rounded-lg self-start sm:self-auto">
                    {(['MONTH', 'YEAR', 'ALL_TIME'] as RevenuePeriod[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => onPeriodChange(p)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${period === p
                                    ? 'bg-white text-text-main shadow-sm'
                                    : 'text-text-secondary hover:text-text-main hover:bg-white/50'
                                }`}
                        >
                            {p === 'MONTH' ? 'This Month' : p === 'YEAR' ? 'This Year' : 'All Time'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis
                            dataKey="label"
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
                            labelFormatter={(label) => `Period: ${label}`}
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
