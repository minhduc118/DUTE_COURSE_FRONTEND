import React, { useState } from "react";
import { CourseModel, SectionModel, LessonModel } from "../../model/CourseModel";
import { useNavigate } from "react-router-dom";
import { getLessonById } from "../../api/CourseAPI";

interface CourseContentProps {
    course: CourseModel;
    slug?: string;
    addToast: (message: string, type: "success" | "warning" | "error") => void;
}

export const CourseContent: React.FC<CourseContentProps> = ({
    course,
    slug,
    addToast,
}) => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<number | null>(
        course.sections && course.sections.length > 0
            ? course.sections[0].sectionId
            : null
    );

    const toggleSection = (sectionId: number) => {
        setActiveSection(activeSection === sectionId ? null : sectionId);
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

    const getTotalLessons = () => {
        if (!course?.sections) return 0;
        return course.sections.reduce(
            (acc: number, section: any) => acc + (section.lessons?.length || 0),
            0
        );
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return "0h 0p";
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}p`;
    };

    const handleLessonClick = async (lesson: any) => {
        if (lesson.isPreview) {
            if (slug) navigate(`/courses/${slug}/learn`);
            return;
        }
        try {
            const res = await getLessonById(lesson.lessonId);
            if (res.isLocked) {
                addToast("Bạn cần mua khóa học để học bài này.", "warning");
                return;
            }
            if (slug) navigate(`/courses/${slug}/learn`);
        } catch (error) {
            console.log("Không thể tải bài học", error);
            addToast("Không thể tải bài học", "error");
        }
    };

    return (
        <div className="course-content-accordion">
            <h3 className="content-section-title">Nội dung khóa học</h3>
            <div className="content-stats">
                <span>
                    {course.sections?.length || 0} chương • {getTotalLessons()} bài học •{" "}
                    Thời lượng {formatDuration(getTotalDuration())}
                </span>
                <button className="expand-btn">Mở rộng tất cả</button>
            </div>

            <div className="accordion-container">
                {course.sections
                    ?.sort((a: SectionModel, b: SectionModel) => a.sectionOrder - b.sectionOrder)
                    .map((section: SectionModel) => (
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
                                    <span className="accordion-title">{section.title}</span>
                                </div>
                                <span className="section-meta">
                                    {section.lessons?.length || 0} bài học
                                </span>
                            </button>

                            {activeSection === section.sectionId && (
                                <div className="accordion-body">
                                    {section.lessons
                                        ?.sort((a: LessonModel, b: LessonModel) => a.lessonOrder - b.lessonOrder)
                                        .map((lesson: LessonModel) => (
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
                                                        <span className="badge-preview me-3">Xem trước</span>
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
    );
};
