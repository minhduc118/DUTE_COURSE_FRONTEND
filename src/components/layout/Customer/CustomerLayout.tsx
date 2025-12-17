import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../../../style/CustomerLayout.css";
import { useAuth } from "../../../context/AuthContext";

export default function CustomerLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { path: "/", icon: "bi-house-door", label: "Trang chủ" },
    { path: "/roadmap", icon: "bi-map", label: "Lộ trình" },
    { path: "/my-courses", icon: "bi-mortarboard", label: "Khóa học" },
    { path: "/articles", icon: "bi-file-text", label: "Bài viết" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate("/");
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div className="app-container">
      {/* Left Sidebar Navigation */}
      <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo-container">
          <Link to="/" className="sidebar-logo">
            <div className="logo-icon">
              <i className="bi bi-code-slash"></i>
            </div>
            {!isSidebarCollapsed && (
              <div className="logo-details">
                <h1 className="logo-title">LAB211</h1>
                <p className="logo-subtitle">Học để đi làm</p>
              </div>
            )}
          </Link>
        </div>

        {/* Create Button */}
        <div className="create-btn-container">
          <button className="btn-create">
            <i className="bi bi-plus-lg"></i>
            {!isSidebarCollapsed && <span>Tạo bài viết</span>}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item ${isActive(item.path) ? "active" : ""}`}
            >
              <i className={`bi ${item.icon}`}></i>
              {!isSidebarCollapsed && <span className="menu-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!isSidebarCollapsed && <p>© 2024 Lab211 Inc.</p>}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content-wrapper">
        {/* Top Header */}
        <header className="top-header">
          {/* Mobile Sidebar Toggle (optional functionality) */}
          {/* <button className="btn-toggle-sidebar d-lg-none" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
              <i className="bi bi-list"></i>
           </button> */}

          {/* Search Removed */}
          <div className="flex-grow"></div>

          {/* User Actions */}
          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <Link to="/my-courses" className="my-courses-link">Khóa học của tôi</Link>
                <button className="btn-notification">
                  <i className="bi bi-bell"></i>
                  <span className="notification-badge"></span>
                </button>

                <div className="user-menu-wrapper" ref={dropdownRef}>
                  <div
                    className="user-avatar-btn"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="User" />
                    ) : (
                      <div className="avatar-placeholder">{getInitials(user?.fullName)}</div>
                    )}
                  </div>

                  {showUserDropdown && (
                    <div className="user-dropdown">
                      <div className="dropdown-header">
                        <div className="dropdown-user-info">
                          <div className="name">{user?.fullName}</div>
                          <div className="email">{user?.email}</div>
                        </div>
                      </div>
                      <div className="dropdown-divider"></div>
                      <Link to="/profile" className="dropdown-item">
                        <i className="bi bi-person"></i> Trang cá nhân
                      </Link>
                      <Link to="/settings" className="dropdown-item">
                        <i className="bi bi-gear"></i> Cài đặt
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-item text-danger">
                        <i className="bi bi-box-arrow-right"></i> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-login">Đăng nhập</Link>
                <Link to="/register" className="btn-register">Đăng ký</Link>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="page-content-scroll">
          <div className="page-container-centered">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

