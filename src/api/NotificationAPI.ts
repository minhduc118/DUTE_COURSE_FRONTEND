import { API_BASE_URL } from "../config/config";
import { authFetch } from "./apiHelper";
import { NotificationResponse } from "../model/NotificationModel";

const BASE_URL = `${API_BASE_URL}/api/notifications`;

const NotificationAPI = {
    getMyNotifications: async (): Promise<NotificationResponse[]> => {
        const response = await authFetch(BASE_URL);

        if (!response.ok) {
            throw new Error(`Failed to fetch notifications: ${response.status}`);
        }

        const data = await response.json();
        return data as NotificationResponse[];
    },

    markAllAsRead: async (): Promise<void> => {
        const response = await authFetch(`${BASE_URL}/mark-all-as-read`, {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error(`Failed to mark all as read: ${response.status}`);
        }
    },

    markAsRead: async (notificationId: number): Promise<void> => {
        const response = await authFetch(`${BASE_URL}/mark-as-read/${notificationId}`, {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error(`Failed to mark notification ${notificationId} as read: ${response.status}`);
        }
    }
};

export default NotificationAPI;
