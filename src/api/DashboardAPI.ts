export interface DashboardStats {
    totalRevenue: number;
    revenueChange: number; // percentage
    newStudents: number;
    studentsChange: number;
    newOrders: number;
    ordersChange: number;
    activeCourses: number;
}

export interface RevenueData {
    day: number;
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

const BASE_URL = 'http://localhost:8080/api/dashboard';

// Mock data for now - replace with real API calls later
export async function getDashboardStats(): Promise<DashboardStats> {
    // TODO: Replace with real API call
    return {
        totalRevenue: 150000000,
        revenueChange: 15,
        newStudents: 234,
        studentsChange: 8,
        newOrders: 45,
        ordersChange: 12,
        activeCourses: 12
    };
}

export async function getRevenueData(month: number, year: number): Promise<RevenueData[]> {
    // TODO: Replace with real API call
    const mockData: RevenueData[] = [];
    for (let i = 1; i <= 30; i++) {
        mockData.push({
            day: i,
            revenue: Math.floor(Math.random() * 10000000) + 2000000
        });
    }
    return mockData;
}

export async function getTopCourses(limit: number = 5): Promise<TopCourse[]> {
    // TODO: Replace with real API call
    return [
        { courseId: 1, courseName: 'React Nâng Cao', revenue: 45000000, percentage: 30 },
        { courseId: 2, courseName: 'Node.js Backend', revenue: 35000000, percentage: 23 },
        { courseId: 3, courseName: 'TypeScript Cơ Bản', revenue: 28000000, percentage: 19 },
        { courseId: 4, courseName: 'Spring Boot', revenue: 22000000, percentage: 15 },
        { courseId: 5, courseName: 'MongoDB', revenue: 20000000, percentage: 13 }
    ];
}

export async function getRecentOrders(limit: number = 10): Promise<DashboardOrder[]> {
    // TODO: Replace with real API call
    return [
        {
            orderId: 'ORD001',
            customerName: 'Nguyễn Văn A',
            courseName: 'React Nâng Cao',
            amount: 1500000,
            status: 'PAID',
            createdAt: new Date().toISOString()
        },
        {
            orderId: 'ORD002',
            customerName: 'Trần Thị B',
            courseName: 'Node.js Backend',
            amount: 1200000,
            status: 'PENDING',
            createdAt: new Date(Date.now() - 3600000).toISOString()
        }
    ];
}
