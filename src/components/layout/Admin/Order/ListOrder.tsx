import React, { useState, useEffect, useMemo } from "react";
import { getAllOrders } from "../../../../api/OrderAPI";
import { Pagination } from "../../../common/Pagination";
import { OrderResponseList } from "../../../../model/OrderModel";

export default function ListOrder() {
    const [orders, setOrders] = useState<OrderResponseList[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadOrders();
    }, [page]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await getAllOrders(page, 10);
            setOrders(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error loading orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = useMemo(() => {
        if (!orders || !Array.isArray(orders)) return [];
        return orders.filter((order) =>
            order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.courseName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [orders, searchTerm]);

    const getStatusBadge = (status: string) => {
        const s = status.toUpperCase();
        if (s === 'PAID' || s === 'SUCCESS' || s === 'COMPLETED') {
            return <span className="status-badge status-active">Paid</span>;
        } else if (s === 'PENDING') {
            return <span className="status-badge status-inactive text-warning border-warning bg-warning-subtle">Pending</span>;
        } else if (s === 'CANCELLED' || s === 'FAILED') {
            return <span className="status-badge status-inactive text-danger border-danger bg-danger-subtle">Cancelled</span>;
        }
        return <span className="status-badge status-inactive">{status}</span>;
    };

    return (
        <div className="container-fluid p-0">
            {/* Page Header */}
            <div className="page-header-row">
                <div>
                    <h1 className="page-title">Order Management</h1>
                    <p className="page-subtitle">Track and manage student enrollments and transactions.</p>
                </div>
                <button className="btn-primary-rose">
                    <i className="bi bi-download"></i>
                    Export Orders
                </button>
            </div>

            {/* Search & Filter */}
            <div className="admin-card mb-4">
                <div className="search-filter-bar mb-0">
                    <div className="search-input-wrapper">
                        <i className="bi bi-search search-icon-pos"></i>
                        <input
                            type="text"
                            className="modern-search-input"
                            placeholder="Search by Order ID, User, or Course..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <div className="small text-muted fw-medium">
                            Total: <span className="text-dark fw-bold">{filteredOrders.length} orders</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="admin-card p-0 overflow-hidden">
                <div className="modern-table-container border-0 rounded-0">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Course</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status"></div>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-5 text-muted">No orders found.</td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.orderId}>
                                        <td className="fw-medium text-muted">#{order.orderId}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="rounded-circle bg-light d-flex align-items-center justify-content-center text-secondary fw-bold border" style={{ width: 32, height: 32, fontSize: 12 }}>
                                                    {order.customerName.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="fw-medium text-dark">{order.customerName}</span>
                                            </div>
                                        </td>
                                        <td className="text-primary fw-medium">{order.courseName}</td>
                                        <td className="fw-bold text-dark">{order.orderAmount.toLocaleString()} ₫</td>
                                        <td><span className="badge bg-light text-secondary border">{order.paymentMethod}</span></td>
                                        <td>{getStatusBadge(order.orderStatus)}</td>
                                        <td className="text-muted small">
                                            {new Date(order.orderDate).toLocaleDateString()}
                                            <div style={{ fontSize: 11 }}>{new Date(order.orderDate).toLocaleTimeString()}</div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="d-flex align-items-center justify-content-between px-4 py-3 border-top border-light">
                    <div className="small text-muted">
                        Showing page {page + 1} of {totalPages}
                    </div>
                    <div className="modern-pagination">
                        <button className="page-btn" disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <button className="page-btn active">{page + 1}</button>
                        <button className="page-btn" disabled={page >= totalPages - 1} onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}>
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
