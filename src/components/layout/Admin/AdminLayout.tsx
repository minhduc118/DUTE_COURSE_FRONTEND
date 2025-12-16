import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../../../style/AdminLayout.css";
import { useAuth } from "../../../context/AuthContext";

export default function AdminLayout() {
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
    { path: "/admin", icon: "bi-speedometer2", label: "Dashboard" },
    { path: "/admin/users", icon: "bi-people", label: "Users" },
    { path: "/admin/products", icon: "bi-box-seam", label: "Courses" },
    { path: "/admin/orders", icon: "bi-receipt", label: "Orders" },
    { path: "/admin/analytics", icon: "bi-bar-chart", label: "Analytics" },
    { path: "/admin/settings", icon: "bi-gear", label: "Settings" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
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
    <>
      <div className="d-flex">
        {/* Sidebar */}
        <div
          className={`sidebar ${isSidebarCollapsed ? "collapsed" : "expanded"}`}
        >
          {/* Header */}
          <div className="sidebar-header p-3 d-flex align-items-center justify-content-between">
            {!isSidebarCollapsed && (
              <h5 className="text-dark mb-0 fw-bold">
                <span className="text-primary">Admin</span> Panel
              </h5>
            )}
            <button
              className="btn btn-sm btn-light"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              <i
                className={`bi ${isSidebarCollapsed ? "bi-list" : "bi-x-lg"}`}
              ></i>
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link d-flex align-items-center p-3 text-decoration-none ${isActive(item.path) ? "active" : ""
                  }`}
              >
                <i className={`bi ${item.icon} fs-5`}></i>
                {!isSidebarCollapsed && (
                  <span className="ms-3 fw-medium">{item.label}</span>
                )}
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="user-profile p-3 mt-auto">
            <div
              className={`d-flex align-items-center p-2 ${!isSidebarCollapsed ? "" : "justify-content-center"
                }`}
            >
              <div className="sidebar-avatar flex-shrink-0">
                <i className="bi bi-person fs-5"></i>
              </div>
              {!isSidebarCollapsed && (
                <div className="ms-3 text-dark">
                  <div className="fw-medium small">Admin User</div>
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                    admin@example.com
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`main-content ${isSidebarCollapsed ? "collapsed" : "expanded"
            } w-100`}
        >
          {/* Top Navbar */}
          <nav className="navbar top-navbar">
            <div className="container-fluid px-4">
              {/* Search */}
              <div className="flex-grow-1" style={{ maxWidth: "500px" }}></div>

              {/* Right Section */}
              <div className="d-flex align-items-center gap-3">
                {/* Notifications */}
                <button className="btn btn-light position-relative">
                  <i className="bi bi-bell"></i>
                  <span className="notification-badge"></span>
                </button>

                {/* User Avatar with Dropdown */}
                <div className="user-menu-wrapper" ref={dropdownRef}>
                  <div
                    className="user-avatar"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    style={{ cursor: "pointer" }}
                  >
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt="Avatar"
                        className="user-avatar"
                      />
                    ) : (
                      getInitials(user?.fullName)
                    )}
                  </div>

                  {showUserDropdown && (
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                        <div className="user-dropdown-avatar">
                          {user?.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt="Avatar"
                              className="user-dropdown-avatar"
                            />
                          ) : (
                            getInitials(user?.fullName)
                          )}
                        </div>
                        <div className="user-dropdown-info">
                          <div className="user-dropdown-name">
                            {user?.fullName || "User"}
                          </div>
                          <div className="user-dropdown-email">
                            {user?.email}
                          </div>
                        </div>
                      </div>
                      <div className="user-dropdown-divider"></div>
                      <Link
                        to="/profile"
                        className="user-dropdown-item"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <i className="bi bi-person"></i>
                        <span>Trang cá nhân</span>
                      </Link>
                      <button
                        className="user-dropdown-item"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>

          {/* Page Content */}
          <main
            className="p-4"
            style={{ minHeight: "calc(100vh - 70px)", background: "#f8f9fa" }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}