import React, { useMemo } from "react";
import { CourseModel } from "../../../../model/CourseModel";

interface CourseTableRowProps {
  course: CourseModel;
  onEdit: (course: CourseModel) => void;
  onDelete: (course: CourseModel) => void;
  onViewDetail: (course: CourseModel) => void;
}

export const CourseTableRow: React.FC<CourseTableRowProps> = ({
  course,
  onEdit,
  onDelete,
  onViewDetail,
}) => {
  const thumbnailSrc = useMemo(() => {
    if (!course.thumbnailBase64) return null;
    return course.thumbnailBase64.startsWith("data:")
      ? course.thumbnailBase64
      : `data:image/png;base64,${course.thumbnailBase64}`;
  }, [course.thumbnailBase64]);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "active" || statusLower === "published") {
      return (
        <span className="badge bg-success">
          <i className="bi bi-check-circle me-1"></i>
          {status}
        </span>
      );
    } else if (statusLower === "draft") {
      return (
        <span className="badge bg-warning text-dark">
          <i className="bi bi-file-earmark me-1"></i>
          {status}
        </span>
      );
    } else {
      return (
        <span className="badge bg-danger">
          <i className="bi bi-x-circle me-1"></i>
          {status}
        </span>
      );
    }
  };

  return (
    <tr>
      <td>
        <span className="badge bg-secondary">{course.courseId}</span>
      </td>
      <td>
        <div className="d-flex align-items-center">
          {thumbnailSrc && (
            <img
              src={thumbnailSrc}
              alt={course.title}
              className="rounded me-2"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
          )}
          <div>
            <div className="fw-medium">{course.title}</div>
            <small className="text-muted">{course.slug}</small>
          </div>
        </div>
      </td>
      <td>
        <div>
          <div className="fw-medium text-primary">
            {formatPrice(course.price)}
          </div>
          {course.discountPrice && course.discountPrice < course.price && (
            <div>
              <small className="text-decoration-line-through text-muted">
                {formatPrice(course.discountPrice)}
              </small>
            </div>
          )}
        </div>
      </td>
      <td>
        <i className="bi bi-clock me-1"></i>
        {course.durationInMonths} months
      </td>
      <td>{getStatusBadge(course.status)}</td>
      <td>
        <i className="bi bi-calendar-event me-1"></i>
        {course.createdAt?.slice(0, 10)}
      </td>
      <td>
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-sm btn-outline-info"
            onClick={() => onViewDetail(course)}
            title="View Detail"
          >
            <i className="bi bi-eye"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => onEdit(course)}
            title="Edit"
          >
            <i className="bi bi-pencil"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(course)}
            title="Delete"
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};
