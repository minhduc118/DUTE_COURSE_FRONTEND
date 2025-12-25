import React from 'react';
import { DashboardOrder } from '../../../../api/DashboardAPI';

interface RecentOrdersProps {
    orders: DashboardOrder[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PAID':
                return 'bg-emerald-50 text-emerald-700';
            case 'PENDING':
                return 'bg-amber-50 text-amber-700';
            case 'FAILED':
            case 'CANCELLED':
                return 'bg-red-50 text-red-700';
            case 'EXPIRED':
                return 'bg-gray-50 text-gray-700';
            default:
                return 'bg-gray-50 text-gray-700';
        }
    };

    return (
        <div className="bg-white rounded-xl border border-border-subtle shadow-sm flex flex-col h-full">
            <div className="p-6 border-b border-border-subtle flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-main">Recent Orders</h3>
                <button className="text-text-secondary hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">more_horiz</span>
                </button>
            </div>
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-background-light text-text-secondary font-medium">
                        <tr>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Course</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                        {orders.map((order) => (
                            <tr key={order.orderId} className="hover:bg-background-light/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-text-main">{order.customerName}</td>
                                <td className="px-6 py-4 text-text-secondary">{order.courseName}</td>
                                <td className="px-6 py-4 text-text-main font-medium">{formatCurrency(order.amount)}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-text-secondary">No recent orders</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
