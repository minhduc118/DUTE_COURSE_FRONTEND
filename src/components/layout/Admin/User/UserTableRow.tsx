import React from "react";
import { UserModel } from "../../../../model/UserModel";

interface UserTableRowProps {
  user: UserModel;
  onEdit: (user: UserModel) => void;
  onDelete: (user: UserModel) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  onEdit,
  onDelete,
}) => {
  return (
    <tr>
      <td>
        <span className="badge bg-secondary">{user.userId}</span>
      </td>
      <td className="fw-medium">
        <div className="d-flex align-items-center">
          {/* Avatar (Optional: if we still want to show avatar) */}
          <img
            src={
              user.avatarUrl ||
              "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
            }
            alt={user.fullName}
            className="rounded-circle me-2"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
          {user.fullName}
        </div>
      </td>

      <td>
        <i className="bi bi-envelope me-1"></i>
        {user.email}
      </td>

      <td>
        <i className="bi bi-calendar-event me-1"></i>
        {user.createdAt?.slice(0, 10)}
      </td>
      <td>
        {user.roles?.map((role) => (
          <span key={role.roleId} className="badge bg-secondary me-1">
            <i className="bi bi-person-check me-1"></i>
            {role.roleName}
          </span>
        ))}
      </td>
      <td>
        {user.isActive === true ? (
          <span className="badge bg-success">
            <i className="bi bi-check-circle me-1"></i>
            Active
          </span>
        ) : (
          <span className="badge bg-danger">
            <i className="bi bi-x-circle me-1"></i>
            Inactive
          </span>
        )}
      </td>
      <td>
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => onEdit(user)}
            title="Edit"
          >
            <i className="bi bi-pencil"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(user)}
            title="Delete"
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};
