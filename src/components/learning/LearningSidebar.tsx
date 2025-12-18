import React from "react";
import { SectionModel, LessonModel } from "../../model/CourseModel";
import { formatDuration } from "../../utils/formatUtils";

interface LearningSidebarProps {
    sections: SectionModel[];
    currentLessonId?: number;
    completedLessons: Set<number>;
    expandedSections: Set<number>;
    onToggleSection: (sectionId: number) => void;
    onLessonClick: (lesson: LessonModel, section: SectionModel) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const LearningSidebar: React.FC<LearningSidebarProps> = ({
    sections,
    currentLessonId,
    completedLessons,
    expandedSections,
    onToggleSection,
    onLessonClick,
    searchQuery,
    onSearchChange,
}) => {
    return (
        <aside className="learning-sidebar">
            <div className="sidebar-search-container">
                <h2 className="sidebar-heading">Nội dung khóa học</h2>
                <div className="search-box">
                    <i className="bi bi-search search-icon"></i>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm bài học..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            <div className="curriculum-scroll hide-scrollbar">
                {sections
                    ?.sort((a, b) => a.sectionOrder - b.sectionOrder)
                    .map((section) => {
                        const isExpanded = expandedSections.has(section.sectionId);
                        const lessons = (section.lessons || [])
                            .sort((a, b) => a.lessonOrder - b.lessonOrder)
                            .filter((l) => l.title.toLowerCase().includes(searchQuery.toLowerCase()));

                        if (searchQuery && lessons.length === 0) return null;

                        const completedInSec = lessons.filter((l) => completedLessons.has(l.lessonId)).length;

                        return (
                            <details
                                key={section.sectionId}
                                className="section-details"
                                open={isExpanded || !!searchQuery}
                                onToggle={(e) => {
                                    const isOpen = (e.target as HTMLDetailsElement).open;
                                    // We handle the state externally if needed, or just let details handle its own toggle
                                    // But to keep expandedSections in sync, we call onToggleSection
                                    if (isOpen !== isExpanded) {
                                        onToggleSection(section.sectionId);
                                    }
                                }}
                            >
                                <summary className="section-summary">
                                    <div className="section-summary-left">
                                        <i className="bi bi-chevron-down section-toggle-icon"></i>
                                        <span className="section-title">{section.title}</span>
                                    </div>
                                    <span className="section-progress-count">
                                        {completedInSec}/{lessons.length}
                                    </span>
                                </summary>

                                <div className="lesson-list-sidebar">
                                    {lessons.map((lesson) => {
                                        const isActive = currentLessonId === lesson.lessonId;
                                        const isCompleted = completedLessons.has(lesson.lessonId);

                                        return (
                                            <div
                                                key={lesson.lessonId}
                                                className={`lesson-item-sidebar ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                                                onClick={() => onLessonClick(lesson, section)}
                                            >
                                                {isActive && <div className="active-indicator"></div>}
                                                <i
                                                    className={`bi lesson-status-icon ${isCompleted
                                                        ? "bi-check-circle-fill completed"
                                                        : isActive
                                                            ? "bi-play-circle-fill active"
                                                            : lesson.lessonType === "READING"
                                                                ? "bi-file-text-fill"
                                                                : lesson.lessonType === "QUIZ"
                                                                    ? "bi-question-circle-fill"
                                                                    : lesson.lessonType === "CODING"
                                                                        ? "bi-terminal-fill"
                                                                        : "bi-play-circle-fill"
                                                        }`}
                                                ></i>
                                                <div className="lesson-item-info">
                                                    <p className="sidebar-lesson-title">{lesson.title}</p>
                                                    <div className="sidebar-lesson-meta">
                                                        <i
                                                            className={`bi sidebar-meta-icon ${lesson.lessonType === "READING" ? "bi-book" : "bi-play-btn"
                                                                }`}
                                                        ></i>
                                                        <span className="sidebar-meta-text">
                                                            {formatDuration(lesson.durationSeconds)}
                                                        </span>
                                                    </div>
                                                </div>
                                                {isActive && <span className="sidebar-now-badge">Đang học</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </details>
                        );
                    })}
            </div>

            <div className="sidebar-footer">
                <button className="btn-sidebar-help">
                    <i className="bi bi-question-circle"></i>
                    <span>Trợ giúp & Hỗ trợ</span>
                </button>
            </div>
        </aside>
    );
};


