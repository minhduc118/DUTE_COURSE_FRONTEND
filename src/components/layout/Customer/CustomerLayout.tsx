import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../../../style/CustomerLayout.css";
import { Footer } from "../../common/Footer";
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
    { path: "/roadmap", icon: "bi-signpost-split", label: "Lộ trình" },
    { path: "/my-courses", icon: "bi-mortarboard", label: "Khóa học" },
    { path: "/articles", icon: "bi-file-text", label: "Bài viết" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  console.log(user);

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
    <div className="customer-layout">
      {/* Header */}
      <header className="customer-header">
        <div className="container-fluid px-3">
          <div className="d-flex align-items-center justify-content-between">
            {/* Logo */}
            <Link
              to="/"
              className="d-flex align-items-center text-decoration-none"
            >
              <img src="/logo.jpg" alt="Logo" className="logo-square" />
              <span className="logo-text ms-2">Học Lập Trình Để Đi Làm</span>
            </Link>

            {/* Search Bar */}
            <div className="header-search">
              <i className="bi bi-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Tìm kiếm khóa học, bài viết, video, ..."
              />
            </div>

            {/* Right Menu */}
            <div className="header-menu d-flex align-items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/my-courses"
                    className="text-decoration-none text-dark"
                  >
                    Khóa học của tôi
                  </Link>
                  <button className="btn-icon position-relative">
                    <i className="bi bi-bell"></i>
                  </button>

                  {/* User Avatar with Dropdown */}
                  <div className="user-menu-wrapper" ref={dropdownRef}>
                    <div
                      className="user-avatar"
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                    >
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt="Avatar"
                          className="user-avatar"
                        ></img>
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
                              ></img>
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
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-header-login">
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="btn-header-register">
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="d-flex">
        {/* Sidebar */}
        <aside
          className={`customer-sidebar ${isSidebarCollapsed ? "collapsed" : ""
            }`}
        >
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? "active" : ""}`}
              >
                <i className={`bi ${item.icon}`}></i>
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="customer-main-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
