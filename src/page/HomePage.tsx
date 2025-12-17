import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CourseModel } from "../model/CourseModel";
import { getAllCourses } from "../api/CourseAPI";
import "../style/HomePage.css";

export default function HomePage() {
  const [proCourses, setProCourses] = useState<CourseModel[]>([]);
  const [freeCourses, setFreeCourses] = useState<CourseModel[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await getAllCourses(0, 20);
      const courses = response.result;

      // Filter Pro and Free
      const pro = courses.filter((c) => c.price > 0);
      const free = courses.filter((c) => c.price === 0);

      setProCourses(pro);
      setFreeCourses(free);
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0h 0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const CourseItem = ({ course, isPro }: { course: CourseModel; isPro: boolean }) => {

    // Resolve Thumbnail
    const thumbnailSrc = course.thumbnailBase64?.startsWith("data:")
      ? course.thumbnailBase64
      : course.thumbnailBase64
        ? `data:image/png;base64,${course.thumbnailBase64}`
        : null;

    return (
      <div
        className="course-card-new"
        onClick={() => navigate(`/courses/${course.slug}`)}
      >
        <div className="card-thumb-wrapper">
          {thumbnailSrc ? (
            <img src={thumbnailSrc} alt={course.title} className="card-thumb" />
          ) : (
            <div className={`card-placeholder gradient-${course.courseId % 5}`}>
              <span>{course.title.charAt(0)}</span>
            </div>
          )}
          <div className="card-overlay">
            <button className="btn-card-play">
              <i className="bi bi-play-fill"></i>
            </button>
          </div>
          {isPro && (
            <div className="card-badge">
              <i className="bi bi-crown-fill"></i>
            </div>
          )}
        </div>

        <div className="card-content">
          <h3 className="card-title">{course.title}</h3>

          <div className="card-instructor">
            <div className="instructor-avatar-small">
              {/* Placeholder for instructor avatar */}
              <img src="https://via.placeholder.com/20" alt="Ins" />
            </div>
            <span>Sơn Đặng</span> {/* Hardcoded for now per design */}
          </div>

          <div className="card-rating">
            <i className="bi bi-star-fill text-yellow"></i>
            <span className="rating-val">4.9</span>
            <span className="rating-count">(1.2k đánh giá)</span>
          </div>

          <div className="card-footer">
            <div className="price-box">
              {isPro ? (
                <>
                  {course.discountPrice && course.discountPrice < course.price ? (
                    <>
                      <span className="price-old">{formatPrice(course.price)}</span>
                      <span className="price-current">{formatPrice(course.discountPrice)}</span>
                    </>
                  ) : (
                    <span className="price-current">{formatPrice(course.price)}</span>
                  )}
                </>
              ) : (
                <span className="price-free">Miễn phí</span>
              )}
            </div>
            <div className="meta-box">
              <i className="bi bi-play-circle"></i>
              <span>{course.numberLessons || 0} bài học</span>
              <span className="mx-1">•</span>
              <i className="bi bi-clock"></i>
              <span>{formatDuration(course.durationSeconds)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="homepage-new">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-bg-texture"></div>
          <div className="hero-content-wrapper">
            <div className="hero-text-col">
              <h2 className="hero-headline">Học lập trình để đi làm</h2>
              <p className="hero-subline">
                Thực hành dự án thực tế, lộ trình rõ ràng.<br />
                Khóa học chất lượng cao dành cho người mới bắt đầu.
              </p>
              <button className="btn-hero-cta">Đăng ký ngay</button>
            </div>
            <div className="hero-visual-col">
              <div className="hero-visual-card">
                <div className="visual-deco deco-1"></div>
                <div className="visual-deco deco-2"></div>
                <button className="btn-visual-play">
                  <i className="bi bi-play-fill"></i>
                </button>
              </div>
              <div className="visual-dots">
                <span className="dot active"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
        </section>

        {/* PRO COURSES */}
        {!loading && proCourses.length > 0 && (
          <section>
            <div className="section-header">
              <h2 className="section-heading">Khóa học Pro</h2>
              <span className="badge-new">Mới</span>
            </div>
            <div className="grid-courses">
              {proCourses.map(c => <CourseItem key={c.courseId} course={c} isPro={true} />)}
            </div>
          </section>
        )}

        {/* FREE COURSES */}
        {!loading && freeCourses.length > 0 && (
          <section className="pb-10">
            <div className="section-header">
              <h2 className="section-heading">Khóa học miễn phí</h2>
              <Link to="/roadmap" className="link-roadmap">Xem lộ trình</Link>
            </div>
            <div className="grid-courses">
              {freeCourses.map(c => <CourseItem key={c.courseId} course={c} isPro={false} />)}
            </div>
          </section>
        )}

        {loading && (
          <div className="loading-container">
            <div className="spinner-border text-danger" role="status"></div>
          </div>
        )}
      </div>
    </div>
  );
}
