export interface NotificationResponse {
    notificationId: number;
    message: string;
    createdAt: string; // LocalDateTime string from backend
    targetUrl: string;
    isRead: boolean;
}
