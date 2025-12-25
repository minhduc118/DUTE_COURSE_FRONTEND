import React, { useEffect, useState } from 'react';
import { getAllUser } from '../../../../api/UserAPI';
import { UserModel } from '../../../../model/UserModel';

export default function NewUsers() {
    const [users, setUsers] = useState<UserModel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch latest users (page 0, size 5)
                const data = await getAllUser(0, 5);
                setUsers(data.result);
            } catch (error) {
                console.error("Failed to fetch new users", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const formatTime = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="bg-white rounded-xl border border-border-subtle shadow-sm flex flex-col h-full">
            <div className="p-6 border-b border-border-subtle flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-main">New Users</h3>
                <a href="/admin/users" className="text-sm font-medium text-primary hover:underline">View All</a>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto">
                {loading ? (
                    <div className="text-center text-text-secondary">Loading...</div>
                ) : users.length === 0 ? (
                    <div className="text-center text-text-secondary">No recent users</div>
                ) : (
                    users.map((user) => (
                        <div key={user.userId} className="flex items-center gap-4">
                            <div className="relative">
                                <div
                                    className="bg-center bg-no-repeat bg-cover rounded-full size-10 shadow-sm"
                                    style={{ backgroundImage: `url("${user.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF7bG-wCiS2f45cXB3LBgvytIX6wVRZba5bp-hw99K9sJ3eppVayf9Au9OY0p9Rdm3HOf5jTo7rZNa9rkPIY7BBdt_-72t_9jaIBB8T2B8jqsfzMV-EaJ7sZ8Ca-WkZR649b34W_88OVikqTiqLM3XW9IB9l_OXF1hRBdFTbe2reCv_OJU8QfHAox5DIMvFfBhSxMce_1OvlKXcyKRcpfB47FdP7QGdqOy8Os-KyMFsiRaEQFJNOCYNRt0Ia8UG-VnMIJmZq1yIVc'}")` }}
                                ></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-main truncate">{user.fullName}</p>
                                <p className="text-xs text-text-secondary truncate">{user.email}</p>
                            </div>
                            <div className="text-xs text-text-secondary whitespace-nowrap">{formatTime(user.createdAt || new Date().toISOString())}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
