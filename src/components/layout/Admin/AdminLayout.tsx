import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "../../../style/AdminLayout.css";

export default function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

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

                {/* Profile Dropdown */}
                <div className="dropdown">
                  <button
                    className="btn btn-light d-flex align-items-center gap-2"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    data-bs-toggle="dropdown"
                  >
                    <div className="profile-avatar">
                      <i className="bi bi-person"></i>
                    </div>
                    <i className="bi bi-chevron-down"></i>
                  </button>

                  <ul
                    className={`dropdown-menu dropdown-menu-end ${isProfileOpen ? "show" : ""
                      }`}
                  >
                    <li>
                      <Link className="dropdown-item" to="/admin/profile">
                        <i className="bi bi-person me-2"></i>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/admin/settings">
                        <i className="bi bi-gear me-2"></i>
                        Settings
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item text-danger">
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
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