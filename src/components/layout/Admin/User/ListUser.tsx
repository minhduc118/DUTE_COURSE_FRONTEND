import React, { useState, useMemo } from "react";
import { UserModel } from "../../../../model/UserModel";
import { useUsers } from "../../../../hooks/useUsers";
import { UserHeader } from "./UserHeader";
import { UserSearchBar } from "./UserSearchBar";
import { UserTable } from "./UserTable";
import { Pagination } from "../../../common/Pagination";
import { UserFormModal } from "./UserFormModel";
import { DeleteUserModal } from "./DeleteUserModel";


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
    refresh,
  } = useUsers(0, 10);

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
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

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

  return (
    <div className="container-fluid">
      <UserHeader totalUsers={users.length} onAddUser={handleAddUser} />

      <UserSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalResults={filteredUsers.length}
      />

      <UserTable
        users={filteredUsers}
        loading={loading}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      <div className="d-flex justify-content-end align-items-center mt-3">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
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
