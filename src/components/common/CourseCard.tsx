import React, { useMemo } from "react";
import { CourseModel } from "../../model/CourseModel";
import { Link } from "react-router-dom";
import "../../style/CourseCard.css";

interface CourseCardProps {
  course: CourseModel;
  variant?: "pro" | "free";
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  variant = "pro",
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

  console.log("price", course.price);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0h0p";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h${minutes}p`;
  };

  const getGradientClass = () => {
    const gradients = [
      "gradient-blue",
      "gradient-yellow",
      "gradient-pink",
      "gradient-green",
      "gradient-purple",
    ];
    return gradients[course.courseId % gradients.length];
  };

  return (
    <Link
      to={`/courses/${course.slug}`}
      className={`course-card ${variant} ${getGradientClass()}`}
    >
      <div className="course-card-image">
        {thumbnailSrc ? (
          <img src={thumbnailSrc} alt={course.title} />
        ) : (
          <div className="course-placeholder">
            <i className="bi bi-play-circle"></i>
          </div>
        )}
      </div>

      <div className="course-card-content">
        <div className="course-card-header">
          <h3 className="course-title">{course.title}</h3>
        </div>

        <div className="course-card-info">
          <div className="course-price">
            {typeof course.discountPrice === "number" &&
              course.discountPrice < course.price ? (
              <>
                <span className="price-original">
                  {formatPrice(course.price)}
                </span>
                <span className="price-current">
                  {course.discountPrice === 0
                    ? "Miễn phí"
                    : formatPrice(course.discountPrice)}
                </span>
              </>
            ) : (
              <span className="price-current">
                {course.price === 0 ? "Miễn phí" : formatPrice(course.price)}
              </span>
            )}
          </div>

          <div className="course-meta">
            <div className="course-instructor">
              <i className="bi bi-person-circle"></i>
              <span>Duc Day</span>
            </div>
            {course.averageRating !== undefined && (
              <div className="course-rating">
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`bi ${star <= Math.round(course.averageRating || 0)
                        ? "bi-star-fill"
                        : "bi-star"
                        }`}
                    ></i>
                  ))}
                </div>
                <span className="rating-value">{course.averageRating.toFixed(1)}</span>
              </div>
            )}
            <div className="course-stats">
              <span>
                <i className="bi bi-play-circle"></i>{" "}
                {course.numberLessons || 0}
              </span>
              <span>
                <i className="bi bi-clock"></i>{" "}
                {formatDuration(course.durationSeconds)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
