export interface CreateOrderRequest {
    courseId: number;
    amount: number;
    discountCode?: string;
    userId: number;
    paymentMethod: string;
}

export interface OrderResponse {
    orderId: string;
    amount: number;
    description: string;
    bankAccount: string;
    bankName: string;
    accountName: string;
    expiredAt: number | string;
    status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED';
}

export interface OrderModel {
    orderId: string;
    userId: number;
    courseId: number;
    amount: number;
    discountCode?: string;
    paymentMethod: string;
    status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED';
    createdAt: string;
    updatedAt?: string;
    userName?: string;
    courseTitle?: string;
}

export interface OrderResponseList {
    orderId: string;
    customerName: string;
    orderDate: string;
    orderAmount: number;
    paymentMethod: string;
    orderStatus: string;
    courseName: string;
    bankTrsCode: string;
}

export interface OrderListResponse {
    content: OrderResponseList[];
    totalPages: number;
    totalElements: number;
}
