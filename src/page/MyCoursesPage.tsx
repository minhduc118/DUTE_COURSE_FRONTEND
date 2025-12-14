import React from "react";
import { Link } from "react-router-dom";
import "../style/MyCoursesPage.css";

// Mock data based on the provided image
const enrolledCourses = [
    {
        id: 1,
        topTitle: "React JS",
        topSubtitle: "Learn once, write anywhere",
        title: "Xây Dựng Website với ReactJS",
        lastAccessed: "Học cách đây 2 tháng trước",
        progress: 30,
        gradientClass: "gradient-react",
        iconType: "react", // We'll use an icon or text representation
    },
    {
        id: 2,
        topTitle: "JavaScript",
        topSubtitle: "{.Cơ bản}",
        title: "Lập Trình JavaScript Cơ Bản",
        lastAccessed: "Học cách đây 2 tháng trước",
        progress: 100, // Looks full in the image maybe? Or 90%
        gradientClass: "gradient-js",
        iconType: "js",
    },
    {
        id: 3,
        topTitle: "C++",
        topSubtitle: "Từ cơ bản đến nâng cao",
        title: "Lập trình C++ cơ bản, nâng cao",
        lastAccessed: "Học cách đây 2 năm trước",
        progress: 15,
        gradientClass: "gradient-cpp",
        iconType: "cpp",
    },
    {
        id: 4,
        topTitle: "Kiến Thức Nền Tảng",
        topSubtitle: "Kiến thức nhập môn{}",
        title: "Kiến Thức Nhập Môn IT",
        lastAccessed: "Bạn chưa học khóa này",
        progress: 0,
        gradientClass: "gradient-basic",
        iconType: "basic",
    },
];

export default function MyCoursesPage() {
    return (
        <div className="my-courses-wrapper">
            <div className="my-courses-container">
                <div className="my-courses-header">
                    <h1 className="header-title">Khóa học của tôi</h1>
                    <p className="header-subtitle">Bạn chưa hoàn thành khóa học nào.</p>
                </div>

                <div className="my-courses-list">
                    {enrolledCourses.map((course) => (
                        <div key={course.id} className="my-course-item">
                            {/* Top colored section */}
                            <div className={`course-banner ${course.gradientClass}`}>
                                <div className="banner-content">
                                    {/* Icons/Logos - simplified with CSS/Text for now as we might not have images */}
                                    <div className="banner-icon">
                                        {course.iconType === 'react' && <i className="bi bi-filetype-jsx"></i>}
                                        {course.iconType === 'js' && <span>JS</span>}
                                        {course.iconType === 'cpp' && <i className="bi bi-filetype-cpp"></i>}
                                        {course.iconType === 'basic' && <i className="bi bi-lightbulb"></i>}
                                    </div>
                                    <div className="banner-text">
                                        <h2 className="banner-title">{course.topTitle}</h2>
                                        <span className="banner-subtitle">{course.topSubtitle}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom white section */}
                            <div className="course-details">
                                <h3 className="detail-title">{course.title}</h3>
                                <p className="detail-time">{course.lastAccessed}</p>

                                {/* Progress Bar */}
                                <div className="detail-progress-track">
                                    <div
                                        className="detail-progress-fill"
                                        style={{ width: `${course.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <Link to={`/courses/course-${course.id}/learn`} className="course-link-overlay"></Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
