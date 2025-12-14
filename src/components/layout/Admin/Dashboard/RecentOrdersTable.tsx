import React from 'react';
import { DashboardOrder } from '../../../../api/DashboardAPI';

interface RecentOrdersTableProps {
    orders: DashboardOrder[];
}

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders }) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
                return <span className="badge bg-success">Đã thanh toán</span>;
            case 'PENDING':
                return <span className="badge bg-warning text-dark">Chờ thanh toán</span>;
            case 'EXPIRED':
                return <span className="badge bg-secondary">Hết hạn</span>;
            case 'CANCELLED':
                return <span className="badge bg-danger">Đã hủy</span>;
            default:
                return <span className="badge bg-secondary">{status}</span>;
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'Vừa xong';
        if (minutes < 60) return `${minutes} phút trước`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} giờ trước`;
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title mb-4">Đơn hàng gần đây</h5>
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>Khóa học</th>
                                <th>Số tiền</th>
                                <th>Trạng thái</th>
                                <th>Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.orderId} className={order.status === 'PENDING' ? 'table-warning-subtle' : ''}>
                                    <td><span className="badge bg-primary">{order.orderId}</span></td>
                                    <td className="fw-medium">{order.customerName}</td>
                                    <td>{order.courseName}</td>
                                    <td>{formatCurrency(order.amount)}</td>
                                    <td>{getStatusBadge(order.status)}</td>
                                    <td className="text-muted">{formatTime(order.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
