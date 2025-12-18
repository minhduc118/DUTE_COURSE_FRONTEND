import React from "react";
import { LessonModel, CourseModel, SectionModel } from "../../model/CourseModel";
import { formatDuration } from "../../utils/formatUtils";

interface ReadingLessonProps {
    currentLesson: LessonModel;
    course: CourseModel;
    currentSection: SectionModel | null;
    completedLessons: Set<number>;
    onToggleComplete: (lessonId: number) => void;
    readingProgress: number;
    prevLesson: { lesson: LessonModel; section: SectionModel } | null;
    nextLesson: { lesson: LessonModel; section: SectionModel } | null;
    onLessonClick: (lesson: LessonModel, section: SectionModel) => void;
}

export const ReadingLesson: React.FC<ReadingLessonProps> = ({
    currentLesson,
    course,
    currentSection,
    completedLessons,
    onToggleComplete,
    readingProgress,
    prevLesson,
    nextLesson,
    onLessonClick,
}) => {
    return (
        <div className="reading-lesson-view">
            <div className="reading-progress-sticky">
                <div className="reading-progress-fill" style={{ width: `${readingProgress}%` }}></div>
            </div>

            <div className="reading-article-container">
                <header className="mb-8 pb-8 border-bottom border-secondary border-opacity-25">
                    <div className="d-flex align-items-center mb-4">
                        <span className="reading-header-badge">
                            <i className="bi bi-file-text"></i> Reading
                        </span>
                        <span className="reading-header-date">
                            Cập nhật: {new Date(course.updatedAt || course.createdAt).toLocaleDateString("vi-VN", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                    </div>
                    <h1 className="reading-title">{currentLesson.title}</h1>
                    <div className="reading-meta-row">
                        <div className="reading-meta-item">
                            <i className="bi bi-clock"></i>
                            <span>{formatDuration(currentLesson.durationSeconds)} đọc</span>
                        </div>
                        <div className="reading-meta-item">
                            <i className="bi bi-bar-chart"></i>
                            <span>Cơ bản</span>
                        </div>
                    </div>
                </header>

                <article className="reading-content-prose">
                    <div dangerouslySetInnerHTML={{ __html: currentLesson.readingContent || "Nội dung đang được cập nhật..." }} />

                    {!currentLesson.readingContent && (
                        <>
                            <p className="text-lg">
                                Chào mừng bạn đến với bài đọc về <strong>{currentLesson.title}</strong>.
                                Trong bài này, chúng ta sẽ tìm hiểu sâu hơn về các kiến thức cốt lõi liên quan đến {currentSection?.title}.
                            </p>

                            <div className="article-callout">
                                <i className="bi bi-exclamation-triangle callout-icon"></i>
                                <div className="callout-content">
                                    <h4>Lưu ý quan trọng</h4>
                                    <p>Đây là kiến thức nền tảng rất quan trọng cho các bài thực hành phía sau. Hãy chắc chắn rằng bạn đã nắm vững trước khi tiếp tục.</p>
                                </div>
                            </div>

                            <h2>1. Định nghĩa cơ bản</h2>
                            <p>Kiến thức về {currentLesson.title} giúp lập trình viên có cái nhìn tổng quan và chính xác về cách ứng dụng vận hành.</p>

                            <div className="article-code-wrapper">
                                <div className="code-header">
                                    <span className="code-filename">example.py</span>
                                    <button className="code-copy-btn"><i className="bi bi-clipboard"></i> Copy</button>
                                </div>
                                <div className="code-body">
                                    <pre>
                                        <code>
                                            {`# Ví dụ minh họa\nconst greeting = "Hello World";\nconsole.log(greeting);`}
                                        </code>
                                    </pre>
                                </div>
                            </div>

                            <h2>2. Quy tắc đặt tên</h2>
                            <p>Việc đặt tên biến và hàm theo chuẩn giúp mã nguồn dễ đọc và bảo trì hơn.</p>
                        </>
                    )}
                </article>

                <footer className="reading-footer">
                    <div className="completion-row">
                        <div
                            className={`mark-complete-toggle ${completedLessons.has(currentLesson.lessonId) ? "checked" : ""}`}
                            onClick={() => onToggleComplete(currentLesson.lessonId)}
                        >
                            <div className="checkbox-custom">
                                <i className="bi bi-check-lg"></i>
                            </div>
                            <span className="completion-label">Đánh dấu bài học này đã hoàn thành</span>
                        </div>

                        <div className="completion-nav-btns">
                            <button
                                className="btn-article-nav prev"
                                disabled={!prevLesson}
                                onClick={() => prevLesson && onLessonClick(prevLesson.lesson, prevLesson.section)}
                            >
                                <i className="bi bi-arrow-left"></i> Bài trước
                            </button>
                            <button
                                className="btn-article-nav next"
                                disabled={!nextLesson}
                                onClick={() => nextLesson && onLessonClick(nextLesson.lesson, nextLesson.section)}
                            >
                                Bài tiếp theo <i className="bi bi-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};


