import React from "react";
import { LessonModel, SectionModel, LessonType } from "../../model/CourseModel";
import { formatDuration } from "../../utils/formatUtils";
import { InstructorWidget } from "./widgets/InstructorWidget";
import { UpNextWidget } from "./widgets/UpNextWidget";

interface VideoLessonProps {
    currentLesson: LessonModel;
    currentSection: SectionModel | null;
    activeTab: string;
    onTabChange: (tab: string) => void;
    nextLesson: { lesson: LessonModel; section: SectionModel } | null;
    onLessonClick: (lesson: LessonModel, section: SectionModel) => void;
}

export const VideoLesson: React.FC<VideoLessonProps> = ({
    currentLesson,
    currentSection,
    activeTab,
    onTabChange,
    nextLesson,
    onLessonClick,
}) => {
    const getYouTubeEmbedUrl = (url: string) => {
        if (!url) return "";
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : null;
        if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=0`;
        if (url.includes("youtube.com/embed")) return url;
        return "";
    };

    return (
        <div className="main-container-learning">
            <div className="video-wrapper-learning">
                <div className="aspect-video-container">
                    {currentLesson.lessonType === LessonType.VIDEO || !currentLesson.lessonType ? (
                        currentLesson.youtubeUrl ? (
                            <iframe
                                src={getYouTubeEmbedUrl(currentLesson.youtubeUrl)}
                                title={currentLesson.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-100 h-100"
                            ></iframe>
                        ) : (
                            <div className="d-flex align-items-center justify-content-center h-100 bg-dark text-white">
                                <div className="text-center">
                                    <i className="bi bi-play-circle-fill display-1 text-primary opacity-50"></i>
                                    <p className="mt-3">Video không khả dụng</p>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="d-flex flex-column align-items-center justify-content-center h-100 bg-dark text-white p-4">
                            <i
                                className={`bi ${currentLesson.lessonType === "QUIZ" ? "bi-puzzle" : "bi-code-square"
                                    } display-1 text-primary mb-3`}
                            ></i>
                            <h3>{currentLesson.lessonType === "QUIZ" ? "Bài kiểm tra" : "Bài tập thực hành"}</h3>
                            <p className="text-muted">Tính năng đang được phát triển...</p>
                        </div>
                    )}
                </div>

                <div className="lesson-content-header">
                    <div className="d-flex flex-column gap-2">
                        <h1 className="lesson-main-title">{currentLesson.title}</h1>
                        <div className="lesson-main-meta">
                            <div className="lesson-meta-item">
                                <i className="bi bi-clock"></i>
                                <span>Cập nhật tháng 10, 2023</span>
                            </div>
                            <div className="meta-dot"></div>
                            <div className="lesson-meta-item">
                                <i className="bi bi-person"></i>
                                <span>Minh Đức</span>
                            </div>
                        </div>
                    </div>

                    <div className="lesson-action-row">
                        <button className="btn-lesson-secondary">
                            <i className="bi bi-bookmark"></i> Lưu bài học
                        </button>
                        <button className="btn-lesson-secondary">
                            <i className="bi bi-hand-thumbs-up"></i> Thích
                        </button>
                    </div>
                </div>

                <div className="lesson-details-layout">
                    <div className="lesson-details-main">
                        <div className="lesson-tabs">
                            <button
                                className={`tab-item ${activeTab === "overview" ? "active" : ""}`}
                                onClick={() => onTabChange("overview")}
                            >
                                Tổng quan
                            </button>
                            <button
                                className={`tab-item ${activeTab === "notes" ? "active" : ""}`}
                                onClick={() => onTabChange("notes")}
                            >
                                Ghi chú <span className="tab-count">0</span>
                            </button>
                            <button
                                className={`tab-item ${activeTab === "qa" ? "active" : ""}`}
                                onClick={() => onTabChange("qa")}
                            >
                                Hỏi đáp <span className="tab-count">0</span>
                            </button>
                        </div>

                        <div className="tab-content-pane">
                            {activeTab === "overview" && (
                                <div className="animate__animated animate__fadeIn">
                                    <p>
                                        Chào mừng bạn đến với bài học <strong>{currentLesson.title}</strong>.
                                        Trong bài học này chúng ta sẽ cùng tìm hiểu về các khái niệm quan trọng liên quan đến {currentSection?.title}.
                                    </p>
                                    <h3 className="lesson-overview-title">Nội dung bài học:</h3>
                                    <ul className="overview-list">
                                        <li>Lý thuyết cơ bản và các ví dụ thực tế.</li>
                                        <li>Cách áp dụng vào dự án thực tế.</li>
                                        <li>Lưu ý quan trọng khi triển khai.</li>
                                    </ul>
                                    <p>Hãy cùng bắt đầu nào!</p>
                                </div>
                            )}
                            {activeTab === "notes" && <p>Chưa có ghi chú nào cho bài học này.</p>}
                            {activeTab === "qa" && <p>Câu hỏi và thảo luận sẽ hiển thị ở đây.</p>}
                        </div>
                    </div>

                    <div className="lesson-details-side">
                        <InstructorWidget />
                        <UpNextWidget nextLesson={nextLesson} onLessonClick={onLessonClick} />
                    </div>
                </div>
            </div>
            <div style={{ height: 40 }}></div>
        </div>
    );
};


