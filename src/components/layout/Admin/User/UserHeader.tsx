import React from 'react';

interface UserHeaderProps {
  totalUsers: number;
  onAddUser: () => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ totalUsers, onAddUser }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="mb-1">User Management</h2>
        <p className="text-muted mb-0">
          Manage all users in the system ({totalUsers} total)
        </p>
      </div>
      <button className="btn btn-primary" onClick={onAddUser}>
        <i className="bi bi-plus-circle me-2"></i>
        Add New User
      </button>
    </div>
  );
};