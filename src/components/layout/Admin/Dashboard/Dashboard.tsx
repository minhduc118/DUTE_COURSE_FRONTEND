import React, { useEffect, useState } from 'react';
import { KPICard } from './KPICard';
import { RevenueChart } from './RevenueChart';
import { TopCoursesChart } from './TopCoursesChart';
import { RecentOrdersTable } from './RecentOrdersTable';
import {
    getDashboardStats,
    getRevenueData,
    getTopCourses,
    getRecentOrders,
    DashboardStats,
    RevenueData,
    TopCourse,
    DashboardOrder
} from '../../../../api/DashboardAPI';

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
    const [topCourses, setTopCourses] = useState<TopCourse[]>([]);
    const [recentOrders, setRecentOrders] = useState<DashboardOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [statsData, revenue, courses, orders] = await Promise.all([
                getDashboardStats(),
                getRevenueData(new Date().getMonth() + 1, new Date().getFullYear()),
                getTopCourses(5),
                getRecentOrders(10)
            ]);

            setStats(statsData);
            setRevenueData(revenue);
            setTopCourses(courses);
            setRecentOrders(orders);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    if (loading || !stats) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* KPI Cards */}
            <div className="row g-4 mb-4">
                <div className="col-xl-3 col-md-6">
                    <KPICard
                        title="Tổng Doanh Thu"
                        value={formatCurrency(stats.totalRevenue)}
                        change={stats.revenueChange}
                        icon="bi-currency-dollar"
                        color="primary"
                    />
                </div>
                <div className="col-xl-3 col-md-6">
                    <KPICard
                        title="Học viên mới"
                        value={stats.newStudents}
                        change={stats.studentsChange}
                        icon="bi-people"
                        color="success"
                    />
                </div>
                <div className="col-xl-3 col-md-6">
                    <KPICard
                        title="Đơn hàng mới"
                        value={stats.newOrders}
                        change={stats.ordersChange}
                        icon="bi-cart"
                        color="warning"
                    />
                </div>
                <div className="col-xl-3 col-md-6">
                    <KPICard
                        title="Khóa học hoạt động"
                        value={stats.activeCourses}
                        change={0}
                        icon="bi-book"
                        color="info"
                    />
                </div>
            </div>

            {/* Charts Section */}
            <div className="row g-4 mb-4">
                <div className="col-lg-8">
                    <RevenueChart data={revenueData} />
                </div>
                <div className="col-lg-4">
                    <TopCoursesChart data={topCourses} />
                </div>
            </div>

            {/* Recent Orders */}
            <div className="row">
                <div className="col-12">
                    <RecentOrdersTable orders={recentOrders} />
                </div>
            </div>
        </div>
    );
}
