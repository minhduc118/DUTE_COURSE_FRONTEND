import React from "react";
import { LessonModel, SectionModel } from "../../../model/CourseModel";
import { formatDuration } from "../../../utils/formatUtils";

interface UpNextWidgetProps {
    nextLesson: { lesson: LessonModel; section: SectionModel } | null;
    onLessonClick: (lesson: LessonModel, section: SectionModel) => void;
}

export const UpNextWidget: React.FC<UpNextWidgetProps> = ({ nextLesson, onLessonClick }) => {
    return (
        <div className="side-widget">
            <h4 className="widget-title">Tiếp theo</h4>
            {nextLesson ? (
                <div
                    className="up-next-card"
                    onClick={() => onLessonClick(nextLesson.lesson, nextLesson.section)}
                    style={{ cursor: "pointer" }}
                >
                    <div className="up-next-thumb">
                        <i className={`bi ${nextLesson.lesson.lessonType === "VIDEO" ? "bi-play-btn" : "bi-file-text"}`}></i>
                    </div>
                    <div className="up-next-info">
                        <span className="up-next-label">Bài kế tiếp</span>
                        <h5 className="up-next-lesson-title">{nextLesson.lesson.title}</h5>
                        <span className="up-next-meta">{formatDuration(nextLesson.lesson.durationSeconds)}</span>
                    </div>
                </div>
            ) : (
                <p className="text-muted small">Bạn đã hoàn thành khóa học!</p>
            )}
        </div>
    );
};
