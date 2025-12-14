import React, { useState, useEffect, useMemo } from "react";
import { getAllOrders } from "../../../../api/OrderAPI";
import { OrderHeader } from "./OrderHeader";
import { OrderSearchBar } from "./OrderSearchBar";
import { OrderTable } from "./OrderTable";
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
            console.log(data);
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
            order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [orders, searchTerm]);

    return (
        <div className="container-fluid">
            <OrderHeader totalOrders={orders?.length || 0} />

            <OrderSearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                totalResults={filteredOrders.length}
            />

            <OrderTable orders={filteredOrders} loading={loading} />

            <div className="d-flex justify-content-end align-items-center mt-3">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(p) => setPage(p)}
                />
            </div>
        </div>
    );
}
