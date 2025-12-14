import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CourseModel } from "../model/CourseModel";
import { getCourseDetail, getLessonById } from "../api/CourseAPI";
import { PaymentModal } from "../components/common/PaymentModal";
import { Toast, ToastContainer, ToastType } from "../components/common/Toast";
import { StudentAvatarList } from "../components/common/StudentAvatarList";
import { FeedbackSection } from "../components/common/FeedbackSection";
import "../style/CourseDetailPage.css";
import { useAuth } from "../context/AuthContext";

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState<CourseModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; message: string; type: ToastType }[]>([]);

  const addToast = (message: string, type: ToastType) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    if (slug) {
      loadCourseDetail();
    }
  }, [slug]);

  const loadCourseDetail = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getCourseDetail(slug);
      console.log("data:", data);
      console.log("isOwner:", data.isOwner);
      setCourse(data);
      if (data.sections && data.sections.length > 0) {
        setActiveSection(data.sections[0].sectionId);
      }

    } catch (err: any) {
      setError(err.message || "Không thể tải chi tiết khóa học");
      console.error("Error loading course detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const thumbnailSrc = useMemo(() => {
    if (!course?.thumbnailBase64) return null;
    return course.thumbnailBase64.startsWith("data:")
      ? course.thumbnailBase64
      : `data:image/png;base64,${course.thumbnailBase64}`;
  }, [course?.thumbnailBase64]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0h 0p";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}p`;
  };

  const getTotalDuration = () => {
    if (!course?.sections) return 0;
    return course.sections.reduce(
      (acc, section) =>
        acc +
        (section.lessons?.reduce(
          (sum, lesson) => sum + (lesson.durationSeconds || 0),
          0
        ) || 0),
      0
    );
  };

  const handleLessonClick = async (lesson: any) => {
    if (lesson.isPreview) {
      navigate(`/courses/${slug}/learn`);
      return;
    }
    try {
      const res = await getLessonById(lesson.lessonId);
      if (res.isLocked) {
        addToast("Bạn cần mua khóa học để học bài này.", "warning");
        return;
      }
      navigate(`/courses/${slug}/learn`);
    } catch (error) {
      console.log("Không thể tải bài học", error);
      addToast("Không thể tải bài học", "error");
    }
  };

  const getTotalLessons = () => {
    if (!course?.sections) return 0;
    return course.sections.reduce(
      (acc, section) => acc + (section.lessons?.length || 0),
      0
    );
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
      {/* Hero Section */}
      <section className="course-hero">
        <div className="container">
          <div className="hero-card">
            <div className="row align-items-center">
              <div className="col-lg-7">
                <h1 className="course-title">{course.title}</h1>
                <p className="course-description">{course.description}</p>

                <div className="course-meta-info">
                  <div className="meta-item">
                    <i className="bi bi-person-circle"></i>
                    <span>Giảng viên</span>
                  </div>
                  <div className="meta-item">
                    <i className="bi bi-play-circle"></i>
                    <span>{getTotalLessons()} bài học</span>
                  </div>
                  <div className="meta-item">
                    <i className="bi bi-clock"></i>
                    <span>{formatDuration(getTotalDuration())}</span>
                  </div>
                </div>

                <div className="course-price-section">
                  {course.discountPrice && course.discountPrice < course.price ? (
                    <>
                      <span className="price-original">
                        {formatPrice(course.price)}
                      </span>
                      <span className="price-current">
                        {formatPrice(course.discountPrice)}
                      </span>
                    </>
                  ) : (
                    <span className="price-current">
                      {course.price === 0
                        ? "Miễn phí"
                        : formatPrice(course.price)}
                    </span>
                  )}
                </div>

                <StudentAvatarList courseId={course.courseId} />

                <div className="course-actions">
                  {!course.isOwner && (
                    <button
                      type="button"
                      className="btn-enroll btn-primary"
                      onClick={() => {
                        if (!isAuthenticated) {
                          navigate("/login", { state: { from: `/courses/${slug}` } });
                          return;
                        }

                        if (course.price === 0) {
                          navigate(`/courses/${slug}/learn`);
                        } else {
                          setShowPaymentModal(true);
                        }
                      }}
                    >
                      {course.price === 0 ? "Học ngay" : "Đăng ký ngay"}
                    </button>
                  )}
                  <button className="btn-secondary">
                    <i className="bi bi-heart"></i> Yêu thích
                  </button>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="course-thumbnail-wrapper">
                  <div className="course-thumbnail">
                    {thumbnailSrc ? (
                      <img src={thumbnailSrc} alt={course.title} />
                    ) : (
                      <div className="thumbnail-placeholder">
                        <i className="bi bi-play-circle"></i>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="course-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h2 className="section-title">Nội dung khóa học</h2>

              {course.sections && course.sections.length > 0 ? (
                <div className="sections-list">
                  {course.sections
                    .sort((a, b) => a.sectionOrder - b.sectionOrder)
                    .map((section) => (
                      <div key={section.sectionId} className="section-card">
                        <div
                          className="section-header"
                          onClick={() =>
                            setActiveSection(
                              activeSection === section.sectionId
                                ? null
                                : section.sectionId
                            )
                          }
                        >
                          <h3 className="section-card-title">
                            {section.title}
                          </h3>
                          <i
                            className={`bi ${activeSection === section.sectionId
                              ? "bi-chevron-up"
                              : "bi-chevron-down"
                              }`}
                          ></i>
                        </div>

                        {activeSection === section.sectionId &&
                          section.lessons && (
                            <div className="lessons-list">
                              {section.lessons
                                .sort((a, b) => a.lessonOrder - b.lessonOrder)
                                .map((lesson) => (
                                  <div
                                    key={lesson.lessonId}
                                    className="lesson-item"
                                  >
                                    <div
                                      className={`lesson-info ${lesson.isPreview ? "clickable" : ""
                                        }`}
                                      onClick={() => handleLessonClick(lesson)}
                                    >
                                      <i className="bi bi-play-circle lesson-icon"></i>
                                      <span className="lesson-title">
                                        {lesson.title}
                                      </span>

                                      {lesson.isPreview && (
                                        <span className="badge-preview">
                                          Xem trước
                                        </span>
                                      )}
                                    </div>
                                    {lesson.durationSeconds && (
                                      <span className="lesson-duration">
                                        {formatDuration(lesson.durationSeconds)}
                                      </span>
                                    )}
                                  </div>
                                ))}
                            </div>
                          )}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted">Chưa có nội dung khóa học</p>
              )}
            </div>

            <div className="col-lg-4">
              <div className="course-sidebar">
                <div className="sidebar-card">
                  <h3>Thông tin khóa học</h3>
                  <div className="info-item">
                    <span className="info-label">Trạng thái:</span>
                    <span
                      className={`status-badge ${course.status.toLowerCase()}`}
                    >
                      {course.status}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Số bài học:</span>
                    <span>{getTotalLessons()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Thời lượng:</span>
                    <span>{formatDuration(getTotalDuration())}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Thời gian học:</span>
                    <span>{course.durationInMonths} tháng</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Ngày tạo:</span>
                    <span>
                      {new Date(course.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeedbackSection courseId={course.courseId} />

      {/* Payment Modal */}
      {course && (
        <PaymentModal
          course={course}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPayment={(discountCode, finalPrice) => {
            console.log("Proceeding to payment with discount:", discountCode, "Price:", finalPrice);
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
        {toasts.map(toast => (
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
