import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../../../../style/UserCourseDetail.css';
import { UserDetailData, LessonProgress } from '../../../../model/UserProgressModel';
import { UserProgressAPI } from '../../../../api/UserProgressAPI';

interface UserCourseDetailPageProps {
    userId: number;
    onBack?: () => void;
}

const UserCourseDetailPage: React.FC<UserCourseDetailPageProps> = ({ userId, onBack }) => {
    // Removed useParams and useNavigate as they are no longer primary for this flow
    // If onBack is not provided, we can fallback to a default navigation or simple console warning

    const [userData, setUserData] = useState<UserDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [lessonDetails, setLessonDetails] = useState<LessonProgress[]>([]);
    const [loadingLessons, setLoadingLessons] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchUserDetail(userId);
        }
    }, [userId]);

    const fetchUserDetail = async (id: number) => {
        try {
            setLoading(true);
            const data = await UserProgressAPI.getUserDetailProgress(id);
            console.log(data);
            setUserData(data);
        } catch (error) {
            console.error("Failed to fetch user details", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewCourseDetails = async (courseId: number) => {
        setSelectedCourseId(courseId);
        try {
            setLoadingLessons(true);
            const lessons = await UserProgressAPI.getCourseLessonsProgress(Number(userId), courseId);
            setLessonDetails(lessons);
        } catch (error) {
            console.error("Failed to fetch lesson details", error);
        } finally {
            setLoadingLessons(false);
        }
    };

    const closeDrawer = () => {
        setSelectedCourseId(null);
        setLessonDetails([]);
    };

    if (loading) {
        return <div className="p-5 text-center">Loading user progress...</div>;
    }

    if (!userData) {
        return <div className="p-5 text-center">User not found.</div>;
    }

    const { kpi, courses } = userData;

    return (
        <div className="ucd-container">
            {/* Header */}
            <div className="ucd-header-section">
                <div className="ucd-breadcrumbs">
                    <Link to="/admin">Home</Link>
                    <i className="bi bi-chevron-right" style={{ fontSize: 12 }}></i>
                    <span onClick={onBack} style={{ cursor: 'pointer' }}>User Management</span>
                    <i className="bi bi-chevron-right" style={{ fontSize: 12 }}></i>
                    <span>User Course Learning Detail</span>
                </div>
                <div className="ucd-title-row">
                    <h1 className="ucd-page-title">User Course Learning Detail</h1>
                    <button className="ucd-btn-back" onClick={onBack}>
                        <i className="bi bi-arrow-left"></i>
                        Back to User Management
                    </button>
                </div>
            </div>

            {/* Profile Card */}
            <div className="ucd-profile-card">
                <div
                    className="ucd-avatar"
                    style={{ backgroundImage: `url(${userData.avatarUrl || 'https://via.placeholder.com/80'})` }}
                ></div>
                <div className="ucd-profile-info">
                    <div className="ucd-profile-name-row">
                        <h2 className="ucd-profile-name">{userData.fullName}</h2>
                        <span className="ucd-role-badge">{userData.role}</span>
                    </div>
                    <div className="ucd-profile-meta">
                        <span><i className="bi bi-envelope me-2"></i>{userData.email}</span>
                        <span><i className="bi bi-calendar-event me-2"></i>Joined: {new Date(userData.joinedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="ucd-kpi-grid">
                {/* Total Courses */}
                <div className="ucd-kpi-card text-rose-600">
                    <div className="ucd-kpi-bg-circle"></div>
                    <div className="ucd-kpi-content">
                        <p className="ucd-kpi-label">Total Courses</p>
                        <h3 className="ucd-kpi-value">{kpi.totalCourses}</h3>
                    </div>
                    <div className="ucd-kpi-footer bg-rose-100 text-rose-600">
                        <i className="bi bi-graph-up me-1"></i> Tracking
                    </div>
                </div>
                {/* Completed */}
                <div className="ucd-kpi-card text-emerald-600">
                    <div className="ucd-kpi-bg-circle"></div>
                    <div className="ucd-kpi-content">
                        <p className="ucd-kpi-label">Completed</p>
                        <h3 className="ucd-kpi-value">{kpi.completedCourses}</h3>
                    </div>
                    <div className="ucd-kpi-footer bg-emerald-100 text-emerald-600">
                        <i className="bi bi-check-circle me-1"></i> Finished
                    </div>
                </div>
                {/* In Progress */}
                <div className="ucd-kpi-card text-amber-800">
                    <div className="ucd-kpi-bg-circle"></div>
                    <div className="ucd-kpi-content">
                        <p className="ucd-kpi-label">In Progress</p>
                        <h3 className="ucd-kpi-value">{kpi.inProgressCourses}</h3>
                    </div>
                    <div className="ucd-kpi-footer bg-amber-100 text-amber-800">
                        <i className="bi bi-clock-history me-1"></i> Active
                    </div>
                </div>
                {/* Avg Progress - Using Primary Blue as accent or maintain Rose if preferred, let's use Blue for check */}
                <div className="ucd-kpi-card text-blue-600">
                    <div className="ucd-kpi-bg-circle"></div>
                    <div className="ucd-kpi-content">
                        <p className="ucd-kpi-label">Avg. Progress</p>
                        <h3 className="ucd-kpi-value">{kpi.avgProgress?.toFixed(2)}%</h3>
                    </div>
                    <div className="ucd-kpi-footer bg-blue-100 text-blue-600">
                        <i className="bi bi-pie-chart me-1"></i> Overall
                    </div>
                </div>
            </div>

            {/* Course Table */}
            <div className="ucd-table-card">
                <div className="ucd-table-header">
                    <h3 className="ucd-table-title">Enrolled Courses</h3>
                    <button className="btn btn-sm btn-outline-secondary rounded-pill px-3">
                        <i className="bi bi-download me-2"></i> Export Report
                    </button>
                </div>
                <div className="ucd-table-container">
                    <table className="ucd-table">
                        <thead>
                            <tr>
                                <th style={{ width: '35%' }}>Course Name</th>
                                <th style={{ width: '15%' }}>Lessons</th>
                                <th style={{ width: '25%' }}>Progress</th>
                                <th style={{ width: '15%' }}>Status</th>
                                <th className="text-end" style={{ width: '10%' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.courseId}>
                                    <td>
                                        <div className="ucd-course-info">
                                            <div className={`ucd-course-icon bg-${course.colorClass}-100 text-${course.colorClass}-600`}>
                                                <i className={`bi bi-${course.icon || 'journal-code'}`}></i>
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark">{course.courseName}</div>
                                                <div className="small text-muted">ID: {course.courseCode}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="fw-bold text-dark">{course.completedLessons}</span>
                                        <span className="text-muted small"> / {course.totalLessons}</span>
                                    </td>
                                    <td>
                                        <div className="w-100" style={{ maxWidth: '160px' }}>
                                            <div className="d-flex justify-content-between small fw-bold mb-1">
                                                <span className={`text-${course.status === 'COMPLETED' ? 'success' : 'primary'}`}>
                                                    {course.progressPercentage}%
                                                </span>
                                            </div>
                                            <div className="ucd-progress-bar-bg">
                                                <div
                                                    className="ucd-progress-bar-fill"
                                                    style={{
                                                        width: `${course.progressPercentage}%`,
                                                        backgroundColor: course.status === 'COMPLETED' ? '#10b981' : 'var(--primary-color)'
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`ucd-status-badge ${course.status === 'COMPLETED' ? 'ucd-status-completed' :
                                            course.status === 'IN_PROGRESS' ? 'ucd-status-in-progress' : 'ucd-status-started'
                                            }`}>
                                            {course.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="text-end">
                                        <button
                                            className="ucd-btn-action"
                                            title="View Details"
                                            onClick={() => handleViewCourseDetails(course.courseId)}
                                        >
                                            <i className="bi bi-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Drawer */}
            {selectedCourseId && (
                <>
                    <div className="ucd-drawer-overlay" onClick={closeDrawer}></div>
                    <div className="ucd-drawer">
                        <div className="ucd-drawer-header">
                            <div>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Course Details</h3>
                                <p style={{ margin: 0, fontSize: 13, color: '#888' }}>
                                    {courses.find(c => c.courseId === selectedCourseId)?.courseName}
                                </p>
                            </div>
                            <button className="ucd-drawer-close" onClick={closeDrawer}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="ucd-drawer-body">
                            {loadingLessons ? (
                                <div className="text-center p-4">Loading lessons...</div>
                            ) : (
                                <div className="ucd-lesson-list">
                                    {lessonDetails.map(lesson => (
                                        <div key={lesson.lessonId} className="ucd-lesson-item" style={{
                                            backgroundColor: lesson.isCompleted ? '#f0fdf4' : 'white',
                                            opacity: lesson.isLocked ? 0.6 : 1
                                        }}>
                                            <div style={{ color: lesson.isCompleted ? '#16a34a' : (lesson.isLocked ? '#ccc' : '#f59e0b') }}>
                                                <i className={`bi ${lesson.isCompleted ? 'bi-check-circle-fill' : (lesson.isLocked ? 'bi-lock-fill' : 'bi-play-circle-fill')}`}></i>
                                            </div>
                                            <div>
                                                <div style={{
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    textDecoration: lesson.isCompleted ? 'line-through' : 'none'
                                                }}>
                                                    {lesson.lessonName}
                                                </div>
                                                <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                                                    {lesson.isCompleted ? `Completed: ${lesson.completedAt}` : (lesson.isLocked ? 'Locked' : 'In Progress')}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserCourseDetailPage;
