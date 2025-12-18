import React from "react";
import { LessonModel, SectionModel } from "../../model/CourseModel";

interface LearningHeaderProps {
    courseTitle: string;
    progressPercentage: number;
    prevLesson: { lesson: LessonModel; section: SectionModel } | null;
    nextLesson: { lesson: LessonModel; section: SectionModel } | null;
    onLessonClick: (lesson: LessonModel, section: SectionModel) => void;
    onBack: () => void;
}

export const LearningHeader: React.FC<LearningHeaderProps> = ({
    courseTitle,
    progressPercentage,
    prevLesson,
    nextLesson,
    onLessonClick,
    onBack,
}) => {
    return (
        <header className="learning-header">
            <div className="header-left">
                <button className="btn-back-learning" onClick={onBack}>
                    <i className="bi bi-arrow-left fs-5"></i>
                </button>
                <div className="header-divider"></div>
                <div className="header-course-info">
                    <span className="header-course-label">Khóa học</span>
                    <h1 className="header-course-title">{courseTitle}</h1>
                </div>
            </div>

            <div className="header-right">
                <div className="header-progress-container">
                    <span className="header-progress-text">{progressPercentage}% Hoàn thành</span>
                    <div className="header-progress-bar-bg">
                        <div
                            className="header-progress-bar-fill"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                <button
                    className="btn-nav-learning prev"
                    disabled={!prevLesson}
                    onClick={() => prevLesson && onLessonClick(prevLesson.lesson, prevLesson.section)}
                >
                    <i className="bi bi-chevron-left"></i>
                    <span>Bài trước</span>
                </button>

                <button
                    className="btn-nav-learning next"
                    disabled={!nextLesson}
                    onClick={() => nextLesson && onLessonClick(nextLesson.lesson, nextLesson.section)}
                >
                    <span>Bài tiếp theo</span>
                    <i className="bi bi-chevron-right"></i>
                </button>
            </div>
        </header>
    );
};


