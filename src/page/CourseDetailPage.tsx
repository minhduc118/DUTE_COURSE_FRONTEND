import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CourseModel } from "../model/CourseModel";
import { Student } from "../model/UserModel";
import { getCourseDetail, getLessonById, getStudentsByCourseId } from "../api/CourseAPI";
import { getCourseReviews } from "../api/CourseReviewAPI";
import { PaymentModal } from "../components/common/PaymentModal";
import { Toast, ToastContainer, ToastType } from "../components/common/Toast";
import { FeedbackSection } from "../components/common/FeedbackSection";
import "../style/CourseDetailPage.css";
import { useAuth } from "../context/AuthContext";

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState<CourseModel | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<number | null>(null);
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
      (acc: number, section: any) =>
        acc +
        (section.lessons?.reduce(
          (sum: number, lesson: any) => sum + (lesson.durationSeconds || 0),
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
      (acc: number, section: any) => acc + (section.lessons?.length || 0),
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

  // Helper to parse benefits
  const benefitsList = course.benefits
    ? course.benefits.split("\n").filter((item) => item.trim() !== "")
    : [];

  const toggleSection = (sectionId: number) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  return (
    <div className="course-detail-page">
      <main className="course-container">
        <div className="course-grid">
          {/* Left Column: Course Content */}
          <div className="main-content">
            {/* Header / Breadcrumbs */}
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
                  <span className="rating-score">{course.averageRating?.toFixed(1) || "0.0"}</span>
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
                        src={student.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`}
                        alt={student.name}
                        title={student.name}
                        className="student-avatar"
                      />
                    ))}
                    {students.length > 5 && (
                      <div className="student-avatar more-avatar" style={{
                        backgroundColor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#64748b',
                        zIndex: 10
                      }}>
                        +{students.length - 5}
                      </div>
                    )}
                  </div>
                  <span>{students.length > 0 ? `${students.length.toLocaleString()} học viên` : "Chưa có học viên"}</span>
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
                  <i className="bi bi-exclamation-circle-fill"></i> Cập nhật lần
                  cuối {new Date(course.createdAt).toLocaleDateString("vi-VN")}
                </span>
                <span className="info-badge">
                  <i className="bi bi-globe"></i> Tiếng Việt
                </span>
              </div>
            </div>

            {/* What you'll learn */}
            {benefitsList.length > 0 && (
              <div className="what-you-learn-box">
                <h3 className="box-title">Bạn sẽ học được gì?</h3>
                <div className="learn-grid">
                  {benefitsList.map((item, idx) => (
                    <div key={idx} className="learn-item">
                      <i className="bi bi-check-lg"></i>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Introduction */}
            {course.introduction && (
              <div className="course-introduction-section">
                <h3 className="content-section-title">Giới thiệu khóa học</h3>
                <div className="introduction-content">
                  {course.introduction}
                </div>
              </div>
            )}

            {/* Course Content Accordion */}
            <div className="course-content-accordion">
              <h3 className="content-section-title">Nội dung khóa học</h3>
              <div className="content-stats">
                <span>
                  {course.sections?.length || 0} chương • {getTotalLessons()}{" "}
                  bài học • Thời lượng {formatDuration(getTotalDuration())}
                </span>
                <button className="expand-btn">Mở rộng tất cả</button>
              </div>

              <div className="accordion-container">
                {course.sections
                  ?.sort((a, b) => a.sectionOrder - b.sectionOrder)
                  .map((section) => (
                    <div key={section.sectionId} className="accordion-item">
                      <button
                        className={`accordion-header ${activeSection !== section.sectionId ? "collapsed" : ""
                          }`}
                        onClick={() => toggleSection(section.sectionId)}
                      >
                        <div className="accordion-title-row">
                          <i
                            className={`bi ${activeSection === section.sectionId
                              ? "bi-chevron-up"
                              : "bi-chevron-down"
                              }`}
                          ></i>
                          <span className="accordion-title">
                            {section.title}
                          </span>
                        </div>
                        <span className="section-meta">
                          {section.lessons?.length || 0} bài học
                        </span>
                      </button>

                      {activeSection === section.sectionId && (
                        <div className="accordion-body">
                          {section.lessons
                            ?.sort((a, b) => a.lessonOrder - b.lessonOrder)
                            .map((lesson) => (
                              <div key={lesson.lessonId} className="lesson-row">
                                <div className="lesson-left">
                                  <i
                                    className={`bi lesson-icon ${lesson.lessonType === "VIDEO"
                                      ? "bi-play-circle-fill"
                                      : lesson.lessonType === "READING"
                                        ? "bi-file-text-fill"
                                        : lesson.lessonType === "QUIZ"
                                          ? "bi-question-circle-fill"
                                          : lesson.lessonType === "CODING"
                                            ? "bi-terminal-fill"
                                            : "bi-play-circle-fill"
                                      }`}
                                  ></i>
                                  <a
                                    href="#"
                                    className="lesson-link"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleLessonClick(lesson);
                                    }}
                                  >
                                    {lesson.title}
                                  </a>
                                </div>
                                <div className="lesson-right">
                                  {lesson.isPreview && (
                                    <span className="badge-preview me-3">
                                      Xem trước
                                    </span>
                                  )}
                                  <span className="lesson-duration">
                                    {formatDuration(lesson.durationSeconds)}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Instructor */}
            <div className="instructor-section">
              <h3 className="content-section-title">Giảng viên</h3>
              <div className="instructor-profile">
                <div
                  className="instructor-avatar-placeholder"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "#ccc",
                  }}
                ></div>
                <div>
                  <div className="instructor-name">DUC DAY</div>
                  <div className="instructor-title">
                    Co-Founder & Fullstack Developer
                  </div>
                </div>
              </div>
              <div className="instructor-stats">
                <div className="stat-item">
                  <i className="bi bi-star-fill"></i> 4.7 Xếp hạng
                </div>
                <div className="stat-item">
                  <i className="bi bi-people-fill"></i> 500,000+ Học viên
                </div>
                <div className="stat-item">
                  <i className="bi bi-play-circle-fill"></i> 12 Khóa học
                </div>
              </div>
              <p className="instructor-bio">
                I'm Angela, I am a developer with a passion for teaching. I'm
                the lead instructor at the London App Brewery, London's leading
                Programming Bootcamp.
              </p>
            </div>

            {/* Reviews Section */}
            <div id="reviews">
              <h3 className="reviews-section-title">Đánh giá từ học viên</h3>
              <FeedbackSection courseId={course.courseId} />
            </div>
          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="course-sidebar-wrapper">
            <div className="sidebar-sticky">
              {/* Video Preview */}
              <div
                className="preview-card"
                onClick={() => navigate(`/courses/${slug}/learn`)}
              >
                <div className="preview-overlay">
                  <div className="play-button">
                    <i className="bi bi-play-fill"></i>
                  </div>
                  <span className="preview-text">Xem trước khóa học này</span>
                </div>
                {thumbnailSrc ? (
                  <img
                    src={thumbnailSrc}
                    className="preview-img"
                    alt="Course Preview"
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "#333",
                    }}
                  ></div>
                )}
              </div>

              {/* Price & Actions */}
              <div className="price-card">
                <div className="price-row">
                  {course.discountPrice &&
                    course.discountPrice < course.price ? (
                    <>
                      <span className="current-price">
                        {formatPrice(course.discountPrice)}
                      </span>
                      <span className="original-price">
                        {formatPrice(course.price)}
                      </span>
                      <span className="discount-badge">
                        GIẢM {Math.round(((course.price - course.discountPrice) / course.price) * 100)}%
                      </span>
                    </>
                  ) : (
                    <span className="current-price">
                      {course.price === 0
                        ? "Miễn phí"
                        : formatPrice(course.price)}
                    </span>
                  )}
                </div>

                <div className="action-buttons">
                  {!course.isOwner ? (
                    <>
                      <button
                        className="btn-add-cart"
                        onClick={() => {
                          if (!isAuthenticated)
                            return navigate("/login", {
                              state: { from: `/courses/${slug}` },
                            });
                          if (course.price === 0)
                            navigate(`/courses/${slug}/learn`);
                          else setShowPaymentModal(true);
                        }}
                      >
                        Đăng ký ngay
                      </button>
                      <button className="btn-buy-now">Thêm vào giỏ hàng</button>
                    </>
                  ) : (
                    <button
                      className="btn-add-cart"
                      onClick={() => navigate(`/courses/${slug}/learn`)}
                    >
                      Vào học ngay
                    </button>
                  )}
                </div>

                <p className="guarantee-text">
                  Đảm bảo hoàn tiền trong 30 ngày
                </p>

                <div className="includes-section">
                  <h4 className="includes-title">Khóa học bao gồm:</h4>
                  <div className="includes-list">
                    <div className="include-item">
                      <i className="bi bi-play-btn"></i>
                      <span>
                        {formatDuration(getTotalDuration())} video theo yêu cầu
                      </span>
                    </div>
                    <div className="include-item">
                      <i className="bi bi-journal-text"></i>
                      <span>{course.numberLessons} bài học</span>
                    </div>
                    <div className="include-item">
                      <i className="bi bi-file-text"></i>
                      <span>{course.readingLessonCount} bài đọc</span>
                    </div>
                    <div className="include-item">
                      <i className="bi bi-camera-video"></i>
                      <span>{course.videoLessonCount} video</span>
                    </div>
                    <div className="include-item">
                      <i className="bi bi-code-square"></i>
                      <span>{course.codingLessonCount} thực hành coding</span>
                    </div>
                    <div className="include-item">
                      <i className="bi bi-patch-question"></i>
                      <span>{course.quizLessonCount} bài kiểm tra</span>
                    </div>
                    <div className="include-item">
                      <i className="bi bi-person-video3"></i>
                      <span>Take care 1 -1 qua meet cùng mentor</span>
                    </div>
                    <div className="include-item">
                      <i className="bi bi-phone"></i>
                      <span>Truy cập trên thiết bị di động</span>
                    </div>
                    <div className="include-item">
                      <i className="bi bi-calendar-check"></i>
                      <span>Truy cập trong {course.durationInMonths} tháng</span>
                    </div>
                    <div className="include-item">
                      <i className="bi bi-trophy"></i>
                      <span>Chứng chỉ hoàn thành</span>
                    </div>
                  </div>
                </div>

                <div className="share-links">
                  <span>Chia sẻ</span>
                  <span>Tặng khóa học này</span>
                  <span>Nhập mã giảm giá</span>
                </div>
              </div>

              {/* Business Ad */}
              <div className="price-card">
                <h4 className="box-title" style={{ fontSize: 18 }}>
                  Đào tạo cho doanh nghiệp?
                </h4>
                <p style={{ fontSize: 14, color: "#475569", marginBottom: 16 }}>
                  Giúp đội ngũ của bạn truy cập hơn 25,000 khóa học hàng đầu bất
                  kỳ lúc nào.
                </p>
                <button
                  className="btn-buy-now"
                  style={{ fontSize: 14, fontWeight: 700 }}
                >
                  Dùng thử Business Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal and ToastContainer */}
      {course && (
        <PaymentModal
          course={course}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPayment={(discountCode, finalPrice) => {
            // ...
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
