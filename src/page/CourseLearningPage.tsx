import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CourseModel, SectionModel, LessonModel } from "../model/CourseModel";
import { getCourseDetail } from "../api/CourseAPI";
import "../style/CourseLearningPage.css";

export default function CourseLearningPage() {
  const { slug } = useParams<{ slug: string }>();
  const [lessonSlug] = useState<string | null>(null);
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<LessonModel | null>(null);
  const [currentSection, setCurrentSection] = useState<SectionModel | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (slug) {
      loadCourseDetail();
    }
  }, [slug]);

  useEffect(() => {
    if (course && course.sections && course.sections.length > 0) {
      // Expand first section by default
      const firstSection = course.sections[0];
      setExpandedSections(new Set([firstSection.sectionId]));

      // Set current lesson to first lesson if no lesson is selected
      if (!currentLesson && firstSection.lessons && firstSection.lessons.length > 0) {
        const firstLesson = firstSection.lessons.sort((a, b) => a.lessonOrder - b.lessonOrder)[0];
        setCurrentLesson(firstLesson);
        setCurrentSection(firstSection);
      }
    }
  }, [course]);

  const loadCourseDetail = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getCourseDetail(slug);
      setCourse(data);
    } catch (err: any) {
      setError(err.message || "Không thể tải chi tiết khóa học");
      console.error("Error loading course detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleLessonClick = (lesson: LessonModel, section: SectionModel) => {
    setCurrentLesson(lesson);
    setCurrentSection(section);
  };

  const getNextLesson = () => {
    if (!course || !currentLesson || !currentSection) return null;

    const allLessons: Array<{ lesson: LessonModel; section: SectionModel }> = [];

    course.sections?.forEach((section) => {
      if (section.lessons) {
        section.lessons
          .sort((a, b) => a.lessonOrder - b.lessonOrder)
          .forEach((lesson) => {
            allLessons.push({ lesson, section });
          });
      }
    });

    const currentIndex = allLessons.findIndex(
      (item) => item.lesson.lessonId === currentLesson.lessonId
    );

    if (currentIndex < allLessons.length - 1) {
      return allLessons[currentIndex + 1];
    }
    return null;
  };

  const getPreviousLesson = () => {
    if (!course || !currentLesson || !currentSection) return null;

    const allLessons: Array<{ lesson: LessonModel; section: SectionModel }> = [];

    course.sections?.forEach((section) => {
      if (section.lessons) {
        section.lessons
          .sort((a, b) => a.lessonOrder - b.lessonOrder)
          .forEach((lesson) => {
            allLessons.push({ lesson, section });
          });
      }
    });

    const currentIndex = allLessons.findIndex(
      (item) => item.lesson.lessonId === currentLesson.lessonId
    );

    if (currentIndex > 0) {
      return allLessons[currentIndex - 1];
    }
    return null;
  };

  const getTotalLessons = () => {
    if (!course?.sections) return 0;
    return course.sections.reduce((acc, section) => acc + (section.lessons?.length || 0), 0);
  };

  const getCompletedLessonsCount = () => {
    return completedLessons.size;
  };

  const getProgressPercentage = () => {
    const total = getTotalLessons();
    if (total === 0) return 0;
    return Math.round((getCompletedLessonsCount() / total) * 100);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "00:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const formatSectionDuration = (section: SectionModel) => {
    if (!section.lessons) return "00:00";
    const totalSeconds = section.lessons.reduce(
      (acc, lesson) => acc + (lesson.durationSeconds || 0),
      0
    );
    return formatDuration(totalSeconds);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return "";

    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // If already an embed URL, return as is
    if (url.includes("youtube.com/embed")) {
      return url;
    }

    return "";
  };

  if (loading) {
    return (
      <div className="course-learning-page">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-learning-page">
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            {error || "Không tìm thấy khóa học"}
          </div>
        </div>
      </div>
    );
  }

  const nextLesson = getNextLesson();
  const prevLesson = getPreviousLesson();

  return (
    <div className="course-learning-page">
      {/* Header */}
      <header className="learning-header">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <button
                className="btn-back"
                onClick={() => navigate(`/courses/${slug}`)}
              >
                <i className="bi bi-arrow-left"></i>
              </button>
              <Link to="/" className="logo-link">
                <img src="/logo.jpg" alt="Logo" className="logo-square-small" />
              </Link>
              <h1 className="course-title-header">{course.title}</h1>
            </div>

            <div className="d-flex align-items-center gap-4">
              <div className="progress-info">
                <span className="progress-percentage">{getProgressPercentage()}%</span>
                <span className="progress-text">
                  {getCompletedLessonsCount()}/{getTotalLessons()} bài học
                </span>
              </div>
              <Link to={`/courses/${slug}/notes`} className="header-link">
                <i className="bi bi-journal-text"></i> Ghi chú
              </Link>
              <Link to={`/courses/${slug}/guide`} className="header-link">
                <i className="bi bi-question-circle"></i> Hướng dẫn
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="learning-content-wrapper">
        {/* Main Content - Video Player */}
        <div className="main-content">
          {currentLesson ? (
            <>
              {/* Video Banner */}
              <div className={`video-banner ${currentLesson.youtubeUrl ? "has-video" : ""}`}>
                {currentLesson.youtubeUrl ? (
                  <div className="video-iframe-container">
                    <iframe
                      src={getYouTubeEmbedUrl(currentLesson.youtubeUrl)}
                      title={currentLesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="video-iframe"
                    ></iframe>
                  </div>
                ) : (
                  <div className="video-banner-content">
                    <div className="banner-left">
                      <h2 className="banner-title-white">{currentLesson.title}</h2>
                    </div>
                    <div className="banner-center">
                      <div className="play-button-large">
                        <i className="bi bi-play-fill"></i>
                      </div>
                    </div>
                    <div className="banner-right">
                      <h2 className="banner-title-orange">
                        {currentSection?.title || course.title}
                      </h2>
                      <p className="banner-subtitle">fullstack.edu.vn</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="video-info">
                <h3 className="video-info-title">{currentLesson.title}</h3>
                <p className="video-info-date">
                  Cập nhật {new Date(course.updatedAt || course.createdAt).toLocaleDateString("vi-VN", {
                    month: "long",
                    year: "numeric"
                  })}
                </p>
              </div>

              {/* Video Actions */}
              <div className="video-actions">
                <button className="btn-add-note">
                  <i className="bi bi-plus-circle"></i> Thêm ghi chú tại 00:00
                </button>
                <button className="btn-qa">
                  <i className="bi bi-chat-dots"></i> Hỏi đáp
                </button>
              </div>

              {/* Navigation */}
              <div className="lesson-navigation">
                {prevLesson ? (
                  <button
                    className="btn-nav prev"
                    onClick={() => handleLessonClick(prevLesson.lesson, prevLesson.section)}
                  >
                    <i className="bi bi-chevron-left"></i> BÀI TRƯỚC
                  </button>
                ) : (
                  <div></div>
                )}
                {nextLesson ? (
                  <button
                    className="btn-nav next"
                    onClick={() => handleLessonClick(nextLesson.lesson, nextLesson.section)}
                  >
                    BÀI TIẾP THEO <i className="bi bi-chevron-right"></i>
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            </>
          ) : (
            <div className="no-lesson-selected">
              <p>Chọn một bài học để bắt đầu</p>
            </div>
          )}
        </div>

        {/* Sidebar - Course Content */}
        <aside className="course-sidebar-learning">
          <div className="sidebar-header">
            <h3 className="sidebar-title">Nội dung khóa học</h3>
          </div>

          {/* Daily Streak */}
          <div className="daily-streak">
            <div className="streak-content">
              <i className="bi bi-fire streak-icon"></i>
              <div>
                <p className="streak-title">Bắt đầu chuỗi ngày học</p>
                <p className="streak-subtitle">Hoàn thành 1 bài để bắt đầu!</p>
              </div>
            </div>
          </div>

          {/* Sections List */}
          <div className="sections-list-learning">
            {course.sections
              ?.sort((a, b) => a.sectionOrder - b.sectionOrder)
              .map((section) => {
                const isExpanded = expandedSections.has(section.sectionId);
                const lessons = section.lessons?.sort((a, b) => a.lessonOrder - b.lessonOrder) || [];
                const completedCount = lessons.filter((l) =>
                  completedLessons.has(l.lessonId)
                ).length;
                const totalCount = lessons.length;

                return (
                  <div key={section.sectionId} className="section-item-learning">
                    <div
                      className="section-header-learning"
                      onClick={() => toggleSection(section.sectionId)}
                    >
                      <div className="section-header-left">
                        <i
                          className={`bi ${isExpanded ? "bi-chevron-down" : "bi-chevron-right"
                            }`}
                        ></i>
                        <span className="section-name">{section.title}</span>
                      </div>
                      <span className="section-progress">
                        {completedCount}/{totalCount} | {formatSectionDuration(section)}
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="lessons-list-learning">
                        {lessons.map((lesson) => {
                          const isActive = currentLesson?.lessonId === lesson.lessonId;
                          const isCompleted = completedLessons.has(lesson.lessonId);
                          const isPreview = lesson.isPreview;

                          return (
                            <div
                              key={lesson.lessonId}
                              className={`lesson-item-learning ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                              onClick={() => handleLessonClick(lesson, section)}
                            >
                              <div className="lesson-item-left">
                                {isCompleted ? (
                                  <i className="bi bi-check-circle-fill lesson-icon completed-icon"></i>
                                ) : lesson.youtubeUrl ? (
                                  <i className="bi bi-play-circle lesson-icon"></i>
                                ) : (
                                  <i className="bi bi-file-text lesson-icon"></i>
                                )}
                                <span className="lesson-name">{lesson.title}</span>
                                {isPreview && (
                                  <span className="badge-preview-small">Xem trước</span>
                                )}
                              </div>
                              <span className="lesson-duration-learning">
                                {formatDuration(lesson.durationSeconds)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </aside>
      </div>
    </div>
  );
}

