import React, { useState, useEffect } from "react";
import { CourseModel } from "../../../../model/CourseModel";

interface CourseFormModalProps {
  show: boolean;
  isEdit: boolean;
  course: CourseModel | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const CourseFormModal: React.FC<CourseFormModalProps> = ({
  show,
  isEdit,
  course,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    benefits: "",
    price: "",
    discountPrice: "",
    durationInMonths: "", // Added durationInMonths
    introduction: "", // Added introduction
    thumbnailBase64: "",
    status: "DRAFT",
  });
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (course && isEdit) {
      setFormData({
        title: course.title || "",
        slug: course.slug || "",
        description: course.description || "",
        benefits: course.benefits || "",
        price: course.price?.toString() || "",
        discountPrice: course.discountPrice?.toString() || "",
        durationInMonths: course.durationInMonths?.toString() || "", // Added durationInMonths
        introduction: course.introduction || "", // Added introduction
        thumbnailBase64: course.thumbnailBase64 || "",
        status: course.status || "DRAFT",
      });
      setThumbnailPreview(
        course.thumbnailBase64
          ? course.thumbnailBase64.startsWith("data:")
            ? course.thumbnailBase64
            : `data:image/png;base64,${course.thumbnailBase64}`
          : null
      );
    } else {
      setFormData({
        title: "",
        slug: "",
        description: "",
        benefits: "",
        price: "",
        discountPrice: "",
        durationInMonths: "", // Added durationInMonths
        introduction: "", // Added introduction
        thumbnailBase64: "",
        status: "DRAFT",
      });
      setThumbnailPreview(null);
    }
  }, [course, isEdit, show]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: !isEdit ? generateSlug(title) : formData.slug,
    });
  };

  const handleClose = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      benefits: "",
      price: "",
      discountPrice: "",
      durationInMonths: "", // Added durationInMonths
      introduction: "", // Added introduction
      thumbnailBase64: "",
      status: "DRAFT",
    });
    setThumbnailPreview(null);
    setErrors({});
    onClose();
  };

  const handleThumbnailFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result?.toString() || "";
        setFormData((prev) => ({
          ...prev,
          thumbnailBase64: result,
        }));
        setThumbnailPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveThumbnail = () => {
    setFormData((prev) => ({ ...prev, thumbnailBase64: "" }));
    setThumbnailPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!formData.thumbnailBase64) {
      setErrors({ thumbnailBase64: "Thumbnail image is required" });
      return;
    }
    try {
      const dataToSend: any = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description || null,
        introduction: formData.introduction || null,
        benefits: formData.benefits || null,
        price: parseFloat(formData.price),
        status: formData.status,
      };

      if (formData.discountPrice) {
        dataToSend.discountPrice = parseFloat(formData.discountPrice);
      }

      if (formData.durationInMonths) { // Added durationInMonths
        dataToSend.durationInMonths = parseInt(formData.durationInMonths);
      }

      if (formData.thumbnailBase64) {
        dataToSend.thumbnailBase64 = formData.thumbnailBase64;
      }

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
                className={`bi ${isEdit ? "bi-pencil-square" : "bi-plus-circle"
                  } me-2`}
              ></i>
              {isEdit ? "Edit Course" : "Add New Course"}
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
                {/* Title */}
                <div className="col-md-6">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? "is-invalid" : ""
                      }`}
                    name="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    required
                  />
                  {errors.title && (
                    <div className="invalid-feedback">{errors.title}</div>
                  )}
                </div>
                {/* Slug */}
                <div className="col-md-6">
                  <label className="form-label">Slug *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.slug ? "is-invalid" : ""
                      }`}
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                  />
                  {errors.slug && (
                    <div className="invalid-feedback">{errors.slug}</div>
                  )}
                </div>
                {/* Description */}
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className={`form-control ${errors.description ? "is-invalid" : ""
                      }`}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                  />
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                </div>
                {/* Benefits */}
                <div className="col-12">
                  <label className="form-label">Lợi ích khóa học (Mỗi dòng một ý)</label>
                  <textarea
                    className={`form-control ${errors.benefits ? "is-invalid" : ""
                      }`}
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleChange}
                    rows={4}
                    placeholder="- Hiểu rõ về..."
                  />
                  {errors.benefits && (
                    <div className="invalid-feedback">{errors.benefits}</div>
                  )}
                </div>
                {/* Introduction */}
                <div className="col-12">
                  <label className="form-label">Introduction (Giới thiệu chi tiết)</label>
                  <textarea
                    className={`form-control ${errors.introduction ? "is-invalid" : ""}`}
                    name="introduction"
                    value={formData.introduction}
                    onChange={handleChange}
                    rows={6}
                  />
                  {errors.introduction && (
                    <div className="invalid-feedback">{errors.introduction}</div>
                  )}
                </div>
                {/* Price, Discount, Duration Row */}
                <div className="col-md-4">
                  <label className="form-label">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`form-control ${errors.price ? "is-invalid" : ""}`}
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                  {errors.price && (
                    <div className="invalid-feedback">{errors.price}</div>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Discount Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`form-control ${errors.discountPrice ? "is-invalid" : ""}`}
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                  />
                  {errors.discountPrice && (
                    <div className="invalid-feedback">{errors.discountPrice}</div>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Duration (Months) *</label>
                  <input
                    type="number"
                    min="1"
                    className={`form-control ${errors.durationInMonths ? "is-invalid" : ""}`}
                    name="durationInMonths"
                    value={formData.durationInMonths}
                    onChange={handleChange}
                    required
                  />
                  {errors.durationInMonths && (
                    <div className="invalid-feedback">{errors.durationInMonths}</div>
                  )}
                </div>

                {/* Status and Thumbnail Row */}
                <div className="col-md-4">
                  <label className="form-label">Status *</label>
                  <select
                    className={`form-select ${errors.status ? "is-invalid" : ""}`}
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                  {errors.status && (
                    <div className="invalid-feedback">{errors.status}</div>
                  )}
                </div>

                <div className="col-md-8">
                  <label className="form-label">Thumbnail *</label>
                  <input
                    type="file"
                    accept="image/*"
                    className={`form-control ${errors.thumbnailBase64 ? "is-invalid" : ""}`}
                    onChange={handleThumbnailFileChange}
                  />
                  <small className="text-muted">
                    Chọn ảnh từ máy, hệ thống sẽ chuyển thành Base64
                  </small>
                  {errors.thumbnailBase64 && (
                    <div className="text-danger mt-1">
                      {errors.thumbnailBase64}
                    </div>
                  )}
                </div>
                {/* Thumbnail Preview */}
                {thumbnailPreview && (
                  <div className="col-12">
                    <label className="form-label">Thumbnail Preview</label>
                    <div>
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="img-thumbnail"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                      <button
                        type="button"
                        className="btn btn-link text-danger p-0 mt-2 d-block"
                        onClick={handleRemoveThumbnail}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Remove thumbnail
                      </button>
                    </div>
                  </div>
                )}
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
                {isEdit ? "Update Course" : "Create Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


