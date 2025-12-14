import React from "react";
import { UserModel } from "../../../../model/UserModel";


interface DeleteUserModalProps {
  show: boolean;
  user: UserModel | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  show,
  user,
  onClose,
  onConfirm,
}) => {
  if (!show || !user) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Confirm Delete
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p className="mb-0">
              Are you sure you want to delete user{" "}
              <strong>{user.fullName}</strong>?
            </p>
            <p className="text-muted small mb-0">
              This action cannot be undone.
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
            >
              <i className="bi bi-trash me-2"></i>
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
