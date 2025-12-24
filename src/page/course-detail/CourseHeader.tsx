import React from "react";
import { CourseModel } from "../../model/CourseModel";
import { Student } from "../../model/UserModel";

interface CourseHeaderProps {
    course: CourseModel;
    students: Student[];
    reviewCount: number;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({
    course,
    students,
    reviewCount,
}) => {
    return (
        <div className="course-header">
            <div className="breadcrumbs">
                <a href="/" className="breadcrumb-link">
                    Khóa học
                </a>
                <span className="breadcrumb-separator">›</span>
                <span className="breadcrumb-current">{course.title}</span>
            </div>

            <h1 className="course-title">{course.title}</h1>
            <p className="course-description">{course.description}</p>

            <div className="course-meta-row">
                <span className="bestseller-badge">Bestseller</span>
                <div className="rating-box">
                    <span className="rating-score">
                        {course.averageRating?.toFixed(1) || "0.0"}
                    </span>
                    <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <i
                                key={star}
                                className={`bi ${(course.averageRating || 0) >= star
                                    ? "bi-star-fill"
                                    : (course.averageRating || 0) >= star - 0.5
                                        ? "bi-star-half"
                                        : "bi-star"
                                    }`}
                            ></i>
                        ))}
                    </div>
                </div>
                <a href="#reviews" className="breadcrumb-link">
                    ({reviewCount.toLocaleString()} đánh giá)
                </a>
                <span className="stat-separator">•</span>
                <div className="d-flex align-items-center gap-2">
                    <div className="avatar-group">
                        {students.slice(0, 5).map((student) => (
                            <img
                                key={student.id}
                                src={
                                    student.avatarUrl ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        student.name
                                    )}&background=random`
                                }
                                alt={student.name}
                                title={student.name}
                                className="student-avatar"
                            />
                        ))}
                        {students.length > 5 && (
                            <div
                                className="student-avatar more-avatar"
                                style={{
                                    backgroundColor: "#f1f5f9",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    color: "#64748b",
                                    zIndex: 10,
                                }}
                            >
                                +{students.length - 5}
                            </div>
                        )}
                    </div>
                    <span>
                        {students.length > 0
                            ? `${students.length.toLocaleString()} học viên`
                            : "Chưa có học viên"}
                    </span>
                </div>
            </div>

            <div className="creator-info">
                <span className="info-badge">
                    Được tạo bởi{" "}
                    <a href="#" className="creator-link">
                        Giảng viên
                    </a>
                </span>
                <span className="info-badge">
                    <i className="bi bi-exclamation-circle-fill"></i> Cập nhật lần cuối{" "}
                    {new Date(course.createdAt).toLocaleDateString("vi-VN")}
                </span>
                <span className="info-badge">
                    <i className="bi bi-globe"></i> Tiếng Việt
                </span>
            </div>
        </div>
    );
};
