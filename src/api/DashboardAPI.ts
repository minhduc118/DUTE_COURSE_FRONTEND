import { API_BASE_URL } from '../config/config';
import { authFetch } from './apiHelper';

export interface DashboardStats {
    totalRevenue: number;
    revenueChange: number; // percentage
    newStudents: number;
    studentsChange: number;
    newOrders: number;
    ordersChange: number;
    activeCourses: number;
    coursesChange: number;
}

export type RevenuePeriod = 'MONTH' | 'YEAR' | 'ALL_TIME';

export interface RevenueData {
    label: string;
    date: string;
    revenue: number;
    [key: string]: any; // Index signature for Recharts compatibility
}

export interface TopCourse {
    courseId: number;
    courseName: string;
    revenue: number;
    percentage: number;
    [key: string]: any; // Index signature for Recharts compatibility
}

export interface DashboardOrder {
    orderId: string;
    customerName: string;
    courseName: string;
    amount: number;
    status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED';
    createdAt: string;
}

const BASE_URL = `${API_BASE_URL}/api/dash-board`;

export async function getDashboardStats(): Promise<DashboardStats> {
    const response = await authFetch(`${BASE_URL}/stats`);
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
    }
    return response.json();
}

export async function getRevenueData(
    period: RevenuePeriod,
    month?: number,
    year?: number
): Promise<RevenueData[]> {
    const params = new URLSearchParams();
    params.append('period', period);
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());

    const response = await authFetch(`${BASE_URL}/revenue?${params.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to fetch revenue data');
    }
    return response.json();
}

export async function getTopCourses(limit: number = 5): Promise<TopCourse[]> {
    const response = await authFetch(`${BASE_URL}/top-courses?limit=${limit}`);
    if (!response.ok) {
        throw new Error('Failed to fetch top courses');
    }
    return response.json();
}

export async function getRecentOrders(limit: number = 10): Promise<DashboardOrder[]> {
    const response = await authFetch(`${BASE_URL}/recent-orders?limit=${limit}`);
    if (!response.ok) {
        throw new Error('Failed to fetch recent orders');
    }
    return response.json();
}
