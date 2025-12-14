import React from "react";
import { OrderResponseList } from "../../../../model/OrderModel";

interface OrderTableRowProps {
    order: OrderResponseList;
}

export const OrderTableRow: React.FC<OrderTableRowProps> = ({ order }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PAID":
                return <span className="badge bg-success">Đã thanh toán</span>;
            case "PENDING":
                return <span className="badge bg-warning">Chờ thanh toán</span>;
            case "EXPIRED":
                return <span className="badge bg-secondary">Hết hạn</span>;
            case "CANCELLED":
                return <span className="badge bg-danger">Đã hủy</span>;
            default:
                return <span className="badge bg-secondary">{status}</span>;
        }
    };

    return (
        <tr>
            <td>
                <span className="badge bg-primary">{order.orderId}</span>
            </td>
            <td className="fw-medium">{order.customerName}</td>
            <td>{order.courseName}</td>
            <td>{formatPrice(order.orderAmount)}</td>
            <td>{order.paymentMethod}</td>
            <td>{order.bankTrsCode}</td>
            <td>{getStatusBadge(order.orderStatus)}</td>
            <td>
                <i className="bi bi-calendar-event me-1"></i>
                {new Date(order.orderDate).toLocaleDateString("vi-VN")}
            </td>
        </tr>
    );
};
