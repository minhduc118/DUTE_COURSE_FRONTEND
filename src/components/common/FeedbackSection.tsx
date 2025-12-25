import React, { useState, useEffect, useMemo } from "react";
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
  isEnrolled?: boolean;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  courseId,
  isEnrolled,
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
        const data = await getCourseReviews(courseId, 0, 10);
        setReviews(data.content);

        if (isAuthenticated) {
          try {
            const reviewExists = await getCourseReviewExists(courseId);
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

  // Calculate distribution from actual reviews
  const ratingDistribution = useMemo(() => {
    if (reviews.length === 0) return [0, 0, 0, 0, 0];

    const counts = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 stars
    reviews.forEach((r) => {
      const rating = Math.round(r.rating);
      if (rating >= 1 && rating <= 5) {
        counts[5 - rating]++;
      }
    });

    return counts.map((count) => Math.round((count / reviews.length) * 100));
  }, [reviews]);

  const handleSubmit = async () => {
    if (newRating === 0 || !newComment.trim()) return;

    try {
      const reviewRequest: CourseReviewRequest = {
        courseId: courseId,
        rating: newRating,
        comment: newComment,
      };

      if (hasReviewed) {
        await updateCourseReview(reviewRequest);
        const data = await getCourseReviews(courseId, 0, 10);
        setReviews(data.content);
        addToast("Đánh giá của bạn đã được cập nhật!", "success");
      } else {
        const createdReview = await addCourseReview(reviewRequest);
        setReviews([createdReview, ...reviews]);
        setHasReviewed(true);
        addToast("Đánh giá của bạn đã được gửi!", "success");
      }
    } catch (err) {
      setError("Không thể gửi đánh giá. Vui lòng thử lại.");
      console.error(err);
    }
  };

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="feedback-section">
      {/* Rating Breakdown Section */}
      <div className="feedback-header-row">
        {/* Left: Big Number */}
        <div className="rating-big-box">
          <div className="rating-number">{averageRating}</div>
          <div className="rating-stars-big">
            {[1, 2, 3, 4, 5].map(s => (
              <i key={s} className={`bi ${s <= Number(averageRating) ? 'bi-star-fill' : s - 0.5 <= Number(averageRating) ? 'bi-star-half' : 'bi-star'}`}></i>
            ))}
          </div>
          <span className="rating-label">Xếp hạng khóa học</span>
        </div>

        {/* Right: Bars */}
        <div className="rating-bars-box">
          {[5, 4, 3, 2, 1].map((star, idx) => (
            <div key={star} className="bar-row">
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${ratingDistribution[idx]}%` }}
                ></div>
              </div>
              <div className="bar-meta">
                <div className="bar-stars">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`bi bi-star-fill ${i < star ? 'filled' : 'empty'}`}></i>
                  ))}
                </div>
                <span className="bar-percent">{ratingDistribution[idx]}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lists */}
      <div className="feedback-list-container">
        <div className="feedback-list">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="reviewer-info">
                <div className="reviewer-avatar">
                  {review.avatar ? <img src={review.avatar} alt={review.authorName} /> : review.authorName.charAt(0)}
                </div>
                <div className="reviewer-details">
                  <div className="reviewer-name">{review.authorName}</div>
                  <div className="review-meta">
                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map(s => <i key={s} className={`bi ${s <= review.rating ? 'bi-star-fill' : 'bi-star'}`}></i>)}
                    </div>
                    <span>• {new Date(review.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="review-text">
                {review.comment}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form - Only for enrolled users */}
      {isAuthenticated ? (
        isEnrolled ? (
          <div className="feedback-form-container">
            <h3 className="form-title">{hasReviewed ? "Chỉnh sửa đánh giá" : "Viết đánh giá"}</h3>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map(s => (
                <i
                  key={s}
                  className={`bi ${s <= newRating ? 'bi-star-fill' : 'bi-star'} star-input`}
                  onClick={() => setNewRating(s)}
                ></i>
              ))}
            </div>
            <textarea
              className="feedback-textarea"
              placeholder="Chia sẻ trải nghiệm..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="btn-submit" onClick={handleSubmit}>
              {hasReviewed ? "Cập nhật" : "Gửi đánh giá"}
            </button>
          </div>
        ) : (
          <div className="feedback-form-container text-center py-4 bg-light rounded-3">
            <i className="bi bi-lock-fill text-muted fs-3 mb-2 d-block"></i>
            <p className="text-muted mb-0">Bạn cần đăng ký khóa học để viết đánh giá.</p>
          </div>
        )
      ) : (
        // Optional: Prompt for login if desired, or nothing
        null
      )}

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
