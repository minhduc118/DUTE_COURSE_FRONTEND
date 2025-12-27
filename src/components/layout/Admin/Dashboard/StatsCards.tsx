import React from 'react';
import { DashboardStats } from '../../../../api/DashboardAPI';

interface StatsCardsProps {
    stats: DashboardStats | null;
}

export default function StatsCards({ stats }: StatsCardsProps) {
    if (!stats) return null;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const cards = [
        {
            title: 'Total Users',
            value: stats.newStudents.toLocaleString(), // Using newStudents as a proxy for total for now or fetch real total if available
            icon: 'group',
            change: stats.studentsChange,
            colorClass: 'text-blue-600 bg-blue-50',
            trend: 'new this month' // Context specific
        },
        {
            title: 'Active Courses',
            value: stats.activeCourses,
            icon: 'menu_book',
            change: stats.coursesChange,
            colorClass: 'text-purple-600 bg-purple-50',
            trend: 'new this month'
        },
        {
            title: 'New Orders',
            value: stats.newOrders,
            icon: 'shopping_cart',
            change: stats.ordersChange,
            colorClass: 'text-orange-600 bg-orange-50',
            trend: 'increase'
        },
        {
            title: 'Total Revenue',
            value: formatCurrency(stats.totalRevenue),
            icon: 'payments',
            change: stats.revenueChange,
            colorClass: 'text-green-600 bg-green-50',
            trend: 'vs previous period'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => (
                <div key={index} className="bg-white p-5 rounded-xl border border-border-subtle shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-text-secondary">{card.title}</p>
                            <h3 className="text-2xl font-bold text-text-main mt-1">{card.value}</h3>
                        </div>
                        <div className={`p-2 rounded-lg ${card.colorClass}`}>
                            <span className="material-symbols-outlined">{card.icon}</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className={`font-medium flex items-center ${card.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            <span className="material-symbols-outlined text-sm mr-0.5">
                                {card.change >= 0 ? 'trending_up' : 'trending_down'}
                            </span>
                            {Math.abs(card.change)}%
                        </span>
                        <span className="text-text-secondary ml-2">{card.trend}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
