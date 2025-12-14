import React from "react";
import { OrderResponseList } from "../../../../model/OrderModel";
import { OrderTableRow } from "./OrderTableRow";

interface OrderTableProps {
    orders: OrderResponseList[];
    loading: boolean;
}

export const OrderTable: React.FC<OrderTableProps> = ({ orders, loading }) => {
    if (loading) {
        return (
            <div className="card">
                <div className="card-body text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Đang tải đơn hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Mã đơn hàng</th>
                                <th>Người mua</th>
                                <th>Khóa học</th>
                                <th>Số tiền</th>
                                <th>Phương thức</th>
                                <th>Mã giao dịch</th>
                                <th>Trạng thái</th>
                                <th>Ngày tạo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-4 text-muted">
                                        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                        Không tìm thấy đơn hàng
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <OrderTableRow key={order.orderId} order={order} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
