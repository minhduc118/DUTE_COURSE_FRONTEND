import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CourseModel } from "../model/CourseModel";
import { Student } from "../model/UserModel";
import { getCourseDetail, getStudentsByCourseId } from "../api/CourseAPI";
import { getCourseReviews } from "../api/CourseReviewAPI";
import { PaymentModal } from "../components/common/PaymentModal";
import { Toast, ToastContainer, ToastType } from "../components/common/Toast";
import { FeedbackSection } from "../components/common/FeedbackSection";
import "../style/CourseDetailPage.css";
import { useAuth } from "../context/AuthContext";

// Child components
import { CourseHeader } from "./course-detail/CourseHeader";
import { CourseBenefits } from "./course-detail/CourseBenefits";
import { CourseContent } from "./course-detail/CourseContent";
import { InstructorInfo } from "./course-detail/InstructorInfo";
import { CourseSidebar } from "./course-detail/CourseSidebar";

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [course, setCourse] = useState<CourseModel | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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
    if (slug) {
      loadCourseDetail();
    }
  }, [slug]);

  useEffect(() => {
    if (course?.courseId) {
      getStudentsByCourseId(course.courseId)
        .then((data) => setStudents(data))
        .catch((err) => console.error("Error loading students:", err));

      getCourseReviews(course.courseId, 0, 1)
        .then((data) => setReviewCount(data.totalElements))
        .catch((err) => console.error("Error loading review count:", err));
    }
  }, [course?.courseId]);

  const loadCourseDetail = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getCourseDetail(slug);
      console.log("Data course page details", data);
      setCourse(data);
    } catch (err: any) {
      setError(err.message || "Không thể tải chi tiết khóa học");
      console.error("Error loading course detail:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="course-detail-page">
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-detail-page">
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            {error || "Không tìm thấy khóa học"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail-page">
      <main className="course-container">
        <div className="course-grid">
          {/* Left Column: Course Content */}
          <div className="main-content">
            <CourseHeader
              course={course}
              students={students}
              reviewCount={reviewCount}
            />

            <CourseBenefits course={course} />

            {course.introduction && (
              <div className="course-introduction-section">
                <h3 className="content-section-title">Giới thiệu khóa học</h3>
                <div className="introduction-content">
                  {course.introduction}
                </div>
              </div>
            )}

            <CourseContent
              course={course}
              slug={slug}
              addToast={addToast}
            />

            <InstructorInfo />

            {/* Reviews Section */}
            <div id="reviews">
              <h3 className="reviews-section-title">Đánh giá từ học viên</h3>
              <FeedbackSection courseId={course.courseId} isEnrolled={course.isOwner} />
            </div>
          </div>

          {/* Right Column: Sticky Sidebar */}
          <CourseSidebar
            course={course}
            slug={slug}
            isAuthenticated={isAuthenticated}
            user={user}
            addToast={addToast}
            setCourse={setCourse}
            setShowPaymentModal={setShowPaymentModal}
          />
        </div>
      </main>

      {/* Payment Modal and ToastContainer */}
      {course && (
        <PaymentModal
          course={course}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPayment={(discountCode, finalPrice) => {
            setShowPaymentModal(false);
            navigate("/payment", {
              state: {
                courseId: course.courseId,
                courseTitle: course.title,
                price: finalPrice || course.discountPrice,
                discountCode: discountCode,
              },
            });
          }}
        />
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
    </div>
  );
}
