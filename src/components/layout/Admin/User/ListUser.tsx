import React, { useState, useMemo } from "react";
import { UserModel } from "../../../../model/UserModel";
import { useUsers } from "../../../../hooks/useUsers";
import { Pagination } from "../../../common/Pagination";
import { UserFormModal } from "./UserFormModel";
import { DeleteUserModal } from "./DeleteUserModel";
import UserCourseDetailPage from "./UserCourseDetailPage";

export default function ListUsers() {
  const {
    users,
    loading,
    page,
    totalPages,
    setPage,
    addUser,
    editUser,
    removeUser,
  } = useUsers(0, 10);

  // State for showing the detail page
  const [detailUserId, setDetailUserId] = useState<number | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Conditional return MUST be after all hooks
  if (detailUserId) {
    return <UserCourseDetailPage userId={detailUserId} onBack={() => setDetailUserId(null)} />;
  }



  const handleAddUser = () => {
    setIsEdit(false);
    setSelectedUser(null);
    setShowFormModal(true);
  };

  const handleEditUser = (user: UserModel) => {
    setIsEdit(true);
    setSelectedUser(user);
    setShowFormModal(true);
  };

  const handleDeleteUser = (user: UserModel) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (formData: any) => {
    if (isEdit && selectedUser) {
      await editUser(selectedUser.userId!, formData);
    } else {
      await addUser(formData);
    }
    setShowFormModal(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      await removeUser(selectedUser.userId!);
      setShowDeleteModal(false);
    }
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const getStatusBadge = (isEnabled: boolean) => {
    if (isEnabled) {
      return <span className="status-badge status-active">Active</span>;
    } else {
      return <span className="status-badge status-inactive">Inactive</span>;
    }
  };

  return (
    <div className="container-fluid p-0">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage system users, roles, and permissions.</p>
        </div>
        <button className="btn-primary-rose" onClick={handleAddUser}>
          <i className="bi bi-person-plus-fill"></i>
          Add New User
        </button>
      </div>

      {/* Search & Filter */}
      <div className="admin-card mb-4">
        <div className="search-filter-bar mb-0">
          <div className="search-input-wrapper">
            <i className="bi bi-search search-icon-pos"></i>
            <input
              type="text"
              className="modern-search-input"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="small text-muted fw-medium">
              Total: <span className="text-dark fw-bold">{filteredUsers.length} users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="admin-card p-0 overflow-hidden">
        <div className="modern-table-container border-0 rounded-0">
          <table className="modern-table">
            <thead>
              <tr>
                <th>User Info</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-muted">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.userId}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm flex-shrink-0"
                          style={{ width: 40, height: 40, background: 'linear-gradient(135deg, var(--primary-rose), #e11d48)' }}
                        >
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.fullName} className="rounded-circle w-100 h-100 object-fit-cover" />
                          ) : getInitials(user.fullName)}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{user.fullName || "Unknown User"}</div>
                          <div className="small text-muted">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {user.roles && user.roles.length > 0 ? user.roles[0].roleName : 'User'}
                      </span>
                    </td>
                    <td>{getStatusBadge(user.isActive)}</td>
                    <td className="text-muted small">
                      <i className="bi bi-calendar3 me-1"></i> {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="text-end">
                      <div className="d-flex align-items-center justify-content-end gap-1">
                        <button className="action-btn edit" title="Edit" onClick={() => handleEditUser(user)}>
                          <i className="bi bi-pencil-square fs-5"></i>
                        </button>
                        <button
                          className="action-btn view"
                          title="View Progress"
                          onClick={() => setDetailUserId(user.userId!)}
                        >
                          <i className="bi bi-eye fs-5"></i>
                        </button>
                        <button className="action-btn delete" title="Delete" onClick={() => handleDeleteUser(user)}>
                          <i className="bi bi-trash fs-5"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="d-flex align-items-center justify-content-between px-4 py-3 border-top border-light">
          <div className="small text-muted">
            Showing page {page + 1} of {totalPages}
          </div>
          <div className="modern-pagination">
            <button className="page-btn" disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>
              <i className="bi bi-chevron-left"></i>
            </button>
            <button className="page-btn active">{page + 1}</button>
            <button className="page-btn" disabled={page >= totalPages - 1} onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}>
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <UserFormModal
        show={showFormModal}
        isEdit={isEdit}
        user={selectedUser}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
      />

      <DeleteUserModal
        show={showDeleteModal}
        user={selectedUser}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
