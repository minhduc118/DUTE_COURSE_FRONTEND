import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CourseModel } from "../model/CourseModel";
import { getAllCourses } from "../api/CourseAPI";
import { CourseCard } from "../components/common/CourseCard";
import "../style/HomePage.css";

export default function HomePage() {
  const [proCourses, setProCourses] = useState<CourseModel[]>([]);
  const [freeCourses, setFreeCourses] = useState<CourseModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);

    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await getAllCourses(0, 20);
      console.log("Courses response:", response);
      const courses = response.result;

      // Phân loại Pro và Free courses
      const pro = courses.filter((c) => c.price > 0);
      const free = courses.filter((c) => c.price === 0);

      setProCourses(pro.slice(0, 10));
      setFreeCourses(free.slice(0, 6));
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="container-fluid px-4">
          <div className="hero-content">
            <div className="hero-left">
              <h1 className="hero-title">F8 trên Youtube</h1>
              <p className="hero-description">
                F8 được nhắc tới ở mọi nơi, ở đâu có cơ hội việc làm cho nghề IT
                và có những con người yêu thích lập trình F8 sẽ ở đó.
              </p>
              {!isLoggedIn ? (
                <div className="hero-auth-buttons">
                  <Link to="/login" className="hero-button hero-button-primary">
                    ĐĂNG NHẬP
                  </Link>
                  <Link to="/register" className="hero-button hero-button-secondary">
                    ĐĂNG KÝ
                  </Link>
                </div>
              ) : (
                <button className="hero-button">ĐĂNG KÝ KÊNH</button>
              )}
            </div>
            <div className="hero-right">
              <div className="hero-play-button">
                <i className="bi bi-play-fill"></i>
              </div>
            </div>
          </div>
          <div className="hero-dots">
            <span className="dot "></span>
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      </section>

      <div className="container-fluid px-4">
        {/* Pro Courses Section */}
        {!loading && proCourses.length > 0 && (
          <section className="courses-section">
            <div className="section-header">
              <h2 className="section-title">
                Khóa học Pro <span className="badge-new">MỚI</span>
              </h2>
            </div>
            <div className="courses-grid">
              {proCourses.map((course) => (
                <CourseCard
                  key={course.courseId}
                  course={course}
                  variant="pro"
                />
              ))}
            </div>
          </section>
        )}

        {/* Free Courses Section */}
        {!loading && freeCourses.length > 0 && (
          <section className="courses-section">
            <div className="section-header">
              <h2 className="section-title">Khóa học miễn phí</h2>
              <Link to="/roadmap" className="view-roadmap-link">
                Xem lộ trình &gt;
              </Link>
            </div>
            <div className="courses-grid">
              {freeCourses.map((course) => (
                <CourseCard
                  key={course.courseId}
                  course={course}
                  variant="free"
                />
              ))}
            </div>
          </section>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && proCourses.length === 0 && freeCourses.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted">Chưa có khóa học nào</p>
          </div>
        )}
      </div>
    </div>
  );
}

