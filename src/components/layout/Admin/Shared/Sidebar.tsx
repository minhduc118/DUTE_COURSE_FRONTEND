import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';

interface SidebarProps {
    isCollapsed?: boolean;
}

export default function Sidebar({ isCollapsed = false }: SidebarProps) {
    const location = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
        navigate('/');
    };

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    return (
        <aside className="w-64 flex-shrink-0 bg-white border-r border-border-subtle flex flex-col justify-between z-20 h-screen transition-all duration-300">
            <div className="flex flex-col h-full">
                {/* Logo Area */}
                <div className="p-6 border-b border-border-subtle flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <span className="material-symbols-outlined text-primary">school</span>
                    </div>
                    <div>
                        <h1 className="text-base font-bold leading-none text-text-main">LAB211 Admin</h1>
                        <p className="text-xs text-text-secondary mt-1">E-learning Platform</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    <Link
                        to="/admin"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${location.pathname === '/admin'
                                ? 'bg-primary/10 text-primary'
                                : 'text-text-secondary hover:bg-background-light hover:text-text-main'
                            }`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${location.pathname === '/admin' ? 'fill-1' : ''}`}>dashboard</span>
                        <span className="text-sm font-medium">Dashboard</span>
                    </Link>

                    <Link
                        to="/admin/users"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/admin/users')
                                ? 'bg-primary/10 text-primary'
                                : 'text-text-secondary hover:bg-background-light hover:text-text-main'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">group</span>
                        <span className="text-sm font-medium">User Management</span>
                    </Link>

                    <Link
                        to="/admin/courses"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/admin/courses')
                                ? 'bg-primary/10 text-primary'
                                : 'text-text-secondary hover:bg-background-light hover:text-text-main'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">school</span>
                        <span className="text-sm font-medium">Courses</span>
                    </Link>

                    <Link
                        to="/admin/orders"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/admin/orders')
                                ? 'bg-primary/10 text-primary'
                                : 'text-text-secondary hover:bg-background-light hover:text-text-main'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                        <span className="text-sm font-medium">Orders</span>
                    </Link>

                    <Link
                        to="/admin/analytics"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/admin/analytics')
                                ? 'bg-primary/10 text-primary'
                                : 'text-text-secondary hover:bg-background-light hover:text-text-main'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">bar_chart</span>
                        <span className="text-sm font-medium">Analytics</span>
                    </Link>

                    <div className="pt-4 mt-4 border-t border-border-subtle px-3">
                        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Settings</p>
                        <Link
                            to="/admin/settings"
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/admin/settings')
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-text-secondary hover:bg-background-light hover:text-text-main'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">settings</span>
                            <span className="text-sm font-medium">System</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-background-light hover:text-text-main transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </nav>

                {/* User Profile Snippet */}
                <div className="p-4 border-t border-border-subtle">
                    <div className="flex items-center gap-3">
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-full size-10 shadow-sm"
                            style={{ backgroundImage: `url("${user?.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF7bG-wCiS2f45cXB3LBgvytIX6wVRZba5bp-hw99K9sJ3eppVayf9Au9OY0p9Rdm3HOf5jTo7rZNa9rkPIY7BBdt_-72t_9jaIBB8T2B8jqsfzMV-EaJ7sZ8Ca-WkZR649b34W_88OVikqTiqLM3XW9IB9l_OXF1hRBdFTbe2reCv_OJU8QfHAox5DIMvFfBhSxMce_1OvlKXcyKRcpfB47FdP7QGdqOy8Os-KyMFsiRaEQFJNOCYNRt0Ia8UG-VnMIJmZq1yIVc'}")` }}
                        ></div>
                        <div className="flex flex-col overflow-hidden">
                            <p className="text-sm font-medium text-text-main truncate">{user?.fullName || 'Admin User'}</p>
                            <p className="text-xs text-text-secondary truncate">{user?.email || 'admin@lab211.com'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
