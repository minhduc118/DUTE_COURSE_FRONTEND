import React from "react";

interface OrderHeaderProps {
    totalOrders: number;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({ totalOrders }) => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 className="mb-1">Quản lý đơn hàng</h2>
                <p className="text-muted mb-0">
                    Tổng số: <strong>{totalOrders}</strong> đơn hàng
                </p>
            </div>
        </div>
    );
};
