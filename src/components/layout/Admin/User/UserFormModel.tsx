import React, { useState, useEffect } from "react";
import { RoleModel, UserModel } from "../../../../model/UserModel";

// Định nghĩa lại các trường trong UserFormModalProps (loại bỏ avatarUrl nếu DTO không có)
interface UserFormModalProps {
  show: boolean;
  isEdit: boolean;
  user: UserModel | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  show,
  isEdit,
  user,
  onClose,
  onSubmit,
}) => {
  // Cập nhật State để khớp với JSON DTO (loại bỏ avatarUrl)
  const [formData, setFormData] = useState({
    password: "",
    email: "",
    fullName: "",
    isActive: true, // Thêm isActive
    roleIds: [] as number[],
  });

  const [rolesList, setRolesList] = useState<RoleModel[]>([
    // MOCK DATA TẠM THỜI cho Roles List để hiển thị Checkbox
    { roleId: 1, roleName: "ADMIN" },
    { roleId: 2, roleName: "USER" },
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Logic tải Roles (Giữ nguyên, nhưng cần un-comment khi kết nối API)
  useEffect(() => {
    if (show) {
      const loadRoles = async () => {
        try {
          // TODO: UN-COMMENT và thay thế bằng API thực tế
          // const data = await getRoles();
          // setRolesList(data);
        } catch (error) {
          console.error("Failed to load roles:", error);
        }
      };
      loadRoles();
    }
  }, [show]);

  // Logic Khởi tạo Form khi mở Modal
  useEffect(() => {
    if (user && isEdit) {
      setFormData({
        password: "", // không hiển thị password cũ
        email: user.email || "",
        fullName: user.fullName || "",
        isActive: user.isActive ?? true, // Lấy giá trị isActive
        roleIds: user.roles?.map((r) => r.roleId || 0) || [],
      });
    } else {
      setFormData({
        password: "",
        email: "",
        fullName: "",
        isActive: true,
        roleIds: [],
      });
    }
  }, [user, isEdit, show]);

  // Cập nhật logic xử lý thay đổi input, bao gồm cả checkbox/boolean
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean;

    if (type === "checkbox") {
      newValue = (e.target as HTMLInputElement).checked;
    } else {
      newValue = value;
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleClose = () => {
    // Reset form data
    setFormData({
      password: "",
      email: "",
      fullName: "",
      isActive: true,
      roleIds: [],
    });
    // Reset errors
    setErrors({});
    // Gọi callback onClose
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      // Loại bỏ password khỏi dữ liệu gửi đi khi EDIT nếu nó rỗng
      const dataToSend =
        isEdit && !formData.password
          ? Object.fromEntries(
            Object.entries(formData).filter(([key]) => key !== "password")
          )
          : formData;

      await onSubmit(dataToSend);
      onClose();
    } catch (err: any) {
      console.log("Submit error:", err);
      if (err?.fieldErrors && typeof err.fieldErrors === "object") {
        setErrors(err.fieldErrors);
      } else {
        setErrors({ general: err?.message || "Đã có lỗi xảy ra" });
      }
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i
                className={`bi ${isEdit ? "bi-pencil-square" : "bi-person-plus"
                  } me-2`}
              ></i>
              {isEdit ? "Edit User" : "Add New User"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {errors.general && (
                <div className="alert alert-danger mb-3">{errors.general}</div>
              )}
              <div className="row g-3">
                {/* Full Name */}
                <div className="col-md-6">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.fullName ? "is-invalid" : ""
                      }`}
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  {errors.fullName && (
                    <div className="invalid-feedback">{errors.fullName}</div>
                  )}
                </div>

                {/* Email */}
                <div className="col-md-6">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""
                      }`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>




                {/* isActive (Trạng thái hoạt động) */}
                <div className="col-md-6 d-flex align-items-center">
                  <div className="form-check form-switch pt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="isActiveSwitch"
                      name="isActive"
                      checked={formData.isActive}
                      // Sử dụng logic riêng cho checkbox để lấy giá trị boolean
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="isActiveSwitch"
                    >
                      User Active
                    </label>
                  </div>
                </div>

                {/* Password (Chỉ hiển thị khi tạo mới) */}
                {!isEdit && (
                  <div className="col-12">
                    <label className="form-label">Password *</label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? "is-invalid" : ""
                        }`}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required={!isEdit}
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>
                )}

                {/* Roles */}
                <div className="col-12">
                  <label className="form-label">Roles *</label>
                  <div className="d-flex flex-wrap">
                    {rolesList.map((role) => (
                      <div key={role.roleId} className="form-check me-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={role.roleId}
                          checked={formData.roleIds.includes(role.roleId)}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            const updated = e.target.checked
                              ? [...formData.roleIds, value]
                              : formData.roleIds.filter((id) => id !== value);
                            setFormData({ ...formData, roleIds: updated });
                          }}
                        />
                        <label className="form-check-label">
                          {role.roleName}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.roleIds && (
                    <div className="text-danger mt-1">{errors.roleIds}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-check-circle me-2"></i>
                {isEdit ? "Update User" : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
