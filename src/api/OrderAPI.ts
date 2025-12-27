import { API_BASE_URL } from "../config/config";
import { CreateOrderRequest, OrderListResponse, OrderResponse } from "../model/OrderModel";
import { getAuthHeaders } from "./apiHelper";

const BASE_URL = `${API_BASE_URL}/api/orders`;

export async function createOrder(request: CreateOrderRequest): Promise<OrderResponse> {
    const response = await fetch(`${BASE_URL}/create`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to create order');
    }

    return response.json();
}

export async function checkOrderStatus(orderId: string): Promise<{ status: string }> {
    const response = await fetch(`${BASE_URL}/${orderId}/status`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to check order status');
    }

    return response.json();
}

export async function getAllOrders(page: number = 0, size: number = 10): Promise<OrderListResponse> {
    const response = await fetch(`${BASE_URL}?page=${page}&size=${size}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }

    return response.json();
}
