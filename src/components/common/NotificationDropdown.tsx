import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../style/NotificationDropdown.css';
import NotificationAPI from '../../api/NotificationAPI';
import { NotificationResponse } from '../../model/NotificationModel';

export const NotificationDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [visibleItems, setVisibleItems] = useState(5);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            // Don't set loading true for background fetches (like initial load)
            // logic can be improved, but for now kept simple
            const data = await NotificationAPI.getMyNotifications();

            // Sort by createdAt desc
            const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setNotifications(sorted);

            // Calculate unread count
            const unread = sorted.filter(n => !n.isRead).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await NotificationAPI.markAllAsRead();
            // Optimistically update UI
            const updated = notifications.map(n => ({ ...n, isRead: true }));
            setNotifications(updated);
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const handleLoadMore = () => {
        setVisibleItems(prev => prev + 5);
    };

    const handleNotificationClick = async (notificationId: number, isRead: boolean) => {
        setIsOpen(false);
        if (!isRead) {
            try {
                await NotificationAPI.markAsRead(notificationId);
                // Update local state
                const updated = notifications.map(n =>
                    n.notificationId === notificationId ? { ...n, isRead: true } : n
                );
                setNotifications(updated);
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch (error) {
                console.error("Failed to mark notification as read", error);
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Refresh on open to get latest
            fetchNotifications();
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Helper to format date
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const getIcon = () => 'bi-bell-fill';

    const visibleNotifications = notifications.slice(0, visibleItems);
    const hasMore = visibleItems < notifications.length;

    return (
        <div className="notification-dropdown-container" ref={dropdownRef}>
            <button
                className="btn-notification"
                onClick={() => setIsOpen(!isOpen)}
                title="Thông báo"
            >
                <i className="bi bi-bell"></i>
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-menu">
                    <div className="notification-header">
                        <h2 className="notification-title">Thông báo</h2>
                        <button
                            className="mark-all-read-btn"
                            onClick={handleMarkAllAsRead}
                            title="Đánh dấu tất cả là đã đọc"
                        >
                            <i className="bi bi-check-all"></i> Đánh dấu đã đọc
                        </button>
                    </div>

                    <div className="notification-list">
                        {loading && notifications.length === 0 ? (
                            <div className="p-3 text-center text-muted">Đang tải...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-4 text-center text-muted">
                                <small>Không có thông báo nào.</small>
                            </div>
                        ) : (
                            visibleNotifications.map(notification => (
                                <a
                                    key={notification.notificationId}
                                    href={notification.targetUrl || '#'}
                                    className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                                    onClick={(e) => {
                                        // If no target URL, prevent default navigation
                                        if (!notification.targetUrl) e.preventDefault();
                                        handleNotificationClick(notification.notificationId, notification.isRead);
                                    }}
                                >
                                    <div className="notification-content-wrapper">
                                        <div className="icon-box">
                                            <i className={`bi ${getIcon()}`}></i>
                                        </div>
                                        <div className="text-content">
                                            <p className="notification-message">
                                                {notification.message}
                                            </p>
                                            <span className="notification-time">{formatDate(notification.createdAt)}</span>
                                        </div>
                                        {!notification.isRead && <span className="unread-dot"></span>}
                                    </div>
                                </a>
                            ))
                        )}
                    </div>

                    <div className="notification-footer">
                        {hasMore ? (
                            <button className="load-more-btn" onClick={handleLoadMore}>
                                Xem thêm thông báo trước đó
                                <i className="bi bi-chevron-down ms-1"></i>
                            </button>
                        ) : (
                            notifications.length > 0 && (
                                <span className="text-muted small">Đã hiển thị tất cả thông báo</span>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
