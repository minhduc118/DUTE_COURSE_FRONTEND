import React, { useEffect, useState } from 'react';
import StatsCards from './StatsCards';
import RevenueChart from './RevenueChart';
import TopSellingCourses from './TopSellingCourses';
import RecentOrders from './RecentOrders';
import NewUsers from './NewUsers';
import {
    getDashboardStats,
    getRevenueData,
    getTopCourses,
    getRecentOrders,
    DashboardStats,
    RevenueData,
    RevenuePeriod,
    TopCourse,
    DashboardOrder
} from '../../../../api/DashboardAPI';

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
    const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>('MONTH');
    const [topCourses, setTopCourses] = useState<TopCourse[]>([]);
    const [recentOrders, setRecentOrders] = useState<DashboardOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        loadRevenueData();
    }, [revenuePeriod]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [statsData, courses, orders] = await Promise.all([
                getDashboardStats(),
                getTopCourses(5),
                getRecentOrders(5)
            ]);
            console.log(statsData);
            setStats(statsData);
            setTopCourses(courses);
            setRecentOrders(orders);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadRevenueData = async () => {
        try {
            const data = await getRevenueData(revenuePeriod, new Date().getMonth() + 1, new Date().getFullYear());
            setRevenueData(data);
        } catch (error) {
            console.error('Error loading revenue data:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Heading & Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-text-main tracking-tight">Dashboard</h2>
                    <p className="text-text-secondary text-sm mt-1">Overview of system performance and activities</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border-subtle text-text-main text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-lg">shopping_bag</span>
                        View Orders
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-primary text-primary text-sm font-medium rounded-lg hover:bg-primary/5 transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-lg">add</span>
                        Add Course
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
                        <span className="material-symbols-outlined text-lg">person_add</span>
                        Add New User
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <StatsCards stats={stats} />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-[400px]">
                    <RevenueChart
                        data={revenueData}
                        period={revenuePeriod}
                        onPeriodChange={setRevenuePeriod}
                    />
                </div>
                <div className="lg:col-span-1 h-[400px]">
                    <TopSellingCourses courses={topCourses} />
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-6">
                <div className="xl:col-span-2">
                    <RecentOrders orders={recentOrders} />
                </div>
                <div className="xl:col-span-1">
                    <NewUsers />
                </div>
            </div>
        </div>
    );
}
