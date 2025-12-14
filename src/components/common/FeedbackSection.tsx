import React, { useState, useEffect } from "react";
import "../../style/FeedbackSection.css";
import {
  getCourseReviews,
  CourseReviewResponse,
  addCourseReview,
  CourseReviewRequest,
  getCourseReviewExists,
  updateCourseReview,
} from "../../api/CourseReviewAPI";
import { Toast, ToastContainer, ToastType } from "./Toast";
import { useAuth } from "../../context/AuthContext";

interface FeedbackSectionProps {
  courseId: number;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  courseId,
}) => {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<CourseReviewResponse[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [toasts, setToasts] = useState<
    { id: number; message: string; type: ToastType }[]
  >([]);

  const addToast = (message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {

        const data = await getCourseReviews(courseId, 0, 5);
        console.log(data);
        setReviews(data.content);


        if (isAuthenticated) {
          try {
            const reviewExists = await getCourseReviewExists(courseId);
            console.log(reviewExists);
            setHasReviewed(reviewExists.review);


            if (reviewExists.review) {
              setNewRating(reviewExists.rating);
              setNewComment(reviewExists.comment);
            }
          } catch (e) {
            console.warn("Could not check if review exists", e);
          }
        }
      } catch (err) {
        setError("Failed to load reviews");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, isAuthenticated]);

  const averageRating =
    reviews.length > 0
      ? (
        reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
      ).toFixed(1)
      : "0.0";

  const handleSubmit = async () => {
    if (newRating === 0 || !newComment.trim()) return;

    try {
      const reviewRequest: CourseReviewRequest = {
        courseId: courseId,
        rating: newRating,
        comment: newComment,
      };

      if (hasReviewed) {
        const updatedReview = await updateCourseReview(reviewRequest);

        const data = await getCourseReviews(courseId, 0, 5);
        setReviews(data.content);
        setError(null);
        addToast("Đánh giá của bạn đã được cập nhật!", "success");
      } else {
        // Create new review
        const createdReview = await addCourseReview(reviewRequest);
        setReviews([createdReview, ...reviews]);
        setHasReviewed(true);
        setError(null);
        addToast("Đánh giá của bạn đã được gửi!", "success");
      }
    } catch (err) {
      setError(
        hasReviewed
          ? "Không thể cập nhật đánh giá. Vui lòng thử lại."
          : "Không thể gửi đánh giá. Vui lòng thử lại."
      );
      console.error(err);
    }
  };

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="feedback-section">
      <div className="container">
        <div className="feedback-header">
          <div>
            <h2 className="feedback-title">Đánh giá khóa học</h2>
            <div className="total-reviews">({reviews.length} đánh giá)</div>
          </div>
          <div className="feedback-summary">
            <div className="average-rating">{averageRating}</div>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`bi ${star <= Number(averageRating) ? "bi-star-fill" : "bi-star"
                    }`}
                ></i>
              ))}
            </div>
          </div>
        </div>

        <div className="row">
          <div className={isAuthenticated ? "col-lg-8" : "col-lg-12"}>
            <div className="feedback-list">
              {reviews.map((review, index) => {
                console.log("Review avatar:", review.avatar);
                return (
                  <div key={index} className="feedback-item">
                    <img
                      src={review.avatar || "https://via.placeholder.com/150"}
                      alt={review.authorName}
                      className="feedback-avatar"
                    />
                    <div className="feedback-content">
                      <div className="feedback-user-name">
                        {review.authorName}
                        <span className="feedback-date">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="feedback-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i
                            key={star}
                            className={`bi ${star <= review.rating ? "bi-star-fill" : "bi-star"
                              }`}
                          ></i>
                        ))}
                      </div>
                      <p className="feedback-text">{review.comment}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {isAuthenticated && (
            <div className="col-lg-4">
              <div className="feedback-form">
                <h3 className="form-title">
                  {hasReviewed
                    ? "Chỉnh sửa đánh giá của bạn"
                    : "Viết đánh giá của bạn"}
                </h3>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`bi ${star <= newRating ? "bi-star-fill" : "bi-star"
                        } star-input ${star <= newRating ? "active" : ""}`}
                      onClick={() => setNewRating(star)}
                    ></i>
                  ))}
                </div>
                <textarea
                  className="feedback-textarea"
                  placeholder="Chia sẻ cảm nghĩ của bạn về khóa học..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button
                  className="btn-submit-feedback"
                  onClick={handleSubmit}
                  disabled={newRating === 0 || !newComment.trim()}
                >
                  {hasReviewed ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </section>
  );
};
