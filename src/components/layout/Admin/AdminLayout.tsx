import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../../../style/AdminModern.css"; // Use new CSS
import { useAuth } from "../../../context/AuthContext";

export default function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { user, logout } = useAuth();
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
    {
      group: "Main", items: [
        { path: "/admin", icon: "bi-speedometer2", label: "Dashboard" },
        { path: "/admin/users", icon: "bi-people", label: "Users" },
        { path: "/admin/products", icon: "bi-box-seam", label: "Courses" },
        { path: "/admin/orders", icon: "bi-receipt", label: "Orders" },
        { path: "/admin/analytics", icon: "bi-bar-chart", label: "Analytics" },
      ]
    },
    {
      group: "System", items: [
        { path: "/admin/settings", icon: "bi-gear", label: "Settings" },
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-logo-area">
          <div className="d-flex align-items-center gap-3">
            <div className="logo-icon-box">L</div>
            {!isSidebarCollapsed && (
              <div className="d-flex flex-column">
                <span className="fw-bold fs-6 text-dark" style={{ lineHeight: 1 }}>LAB211</span>
                <span className="fw-bold text-uppercase" style={{ fontSize: '10px', color: 'var(--primary-rose)', letterSpacing: '1px' }}>Admin</span>
              </div>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((group, idx) => (
            <div key={idx}>
              {!isSidebarCollapsed && <div className="nav-group-label">{group.group}</div>}
              {group.items.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`admin-nav-link ${location.pathname === item.path ? "active" : ""}`}
                >
                  <i className={`bi ${item.icon} fs-5`}></i>
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
              style={{ width: 40, height: 40, background: 'linear-gradient(135deg, var(--primary-rose), #e11d48)' }}
            >
              {user?.fullName ? user.fullName[0].toUpperCase() : 'A'}
            </div>
            {!isSidebarCollapsed && (
              <div className="d-flex flex-column overflow-hidden">
                <span className="fw-bold text-dark text-truncate" style={{ fontSize: '14px' }}>{user?.fullName || 'Admin User'}</span>
                <span className="text-muted text-truncate" style={{ fontSize: '12px' }}>{user?.email || 'admin@lab211.com'}</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="d-flex align-items-center gap-3">
            <button
              className="lg:hidden text-muted border-0 bg-transparent p-0"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              <i className="bi bi-list fs-4"></i>
            </button>
          </div>

          <div className="d-flex align-items-center gap-4">
            <button className="header-action-btn">
              <i className="bi bi-bell fs-5"></i>
              <span className="notif-badge"></span>
            </button>
            <div style={{ width: 1, height: 32, background: 'var(--border-slate-200)' }}></div>

            <div className="position-relative" ref={dropdownRef}>
              <img
                src={user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCuqq0WBpxD92SaRReKzWTIF40yu79QIB_-dnL7OMqv8I3dO2Nzs7ftUgUIIfHwdhz3kkBZiMySr-yQBkHyoTCpa7XluIyjXRkZFP68_6j-997Q78yYQqmIDUgx-aLWSfquOPc_BD_OKZw2KdEQh9pIzc6oMbt0tRcvy44T4vJ_nhU0bpnFqpQRAxCPTBG9JE0LV7kNBNicCUB3VIl9oXqbCw9kg0ICGi46AMaXZb2rfMuSN1XA3zPUgTdsv34PKH-4kiaUhbiMo7A"}
                alt="Profile"
                className="rounded-circle border shadow-sm"
                style={{ width: 36, height: 36, objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              />

              {showUserDropdown && (
                <div className="user-dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 8,
                  width: 200,
                  background: 'white',
                  borderRadius: 12,
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  padding: 8,
                  zIndex: 100
                }}>
                  <button onClick={handleLogout} className="d-flex w-100 align-items-center gap-2 p-2 border-0 bg-transparent rounded hover-bg-light text-danger">
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  );
}