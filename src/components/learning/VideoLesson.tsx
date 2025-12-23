import React, { useState, useRef, useEffect } from "react";
import YouTube, { YouTubeProps, YouTubePlayer } from 'react-youtube';
import { LessonModel, SectionModel, LessonType } from "../../model/CourseModel";
import { formatDuration } from "../../utils/formatUtils";
import { InstructorWidget } from "./widgets/InstructorWidget";
import { UpNextWidget } from "./widgets/UpNextWidget";
import { useLessonProgress } from "../../hooks/useLessonProgress";

interface VideoLessonProps {
    currentLesson: LessonModel;
    currentSection: SectionModel | null;
    activeTab: string;
    onTabChange: (tab: string) => void;
    nextLesson: { lesson: LessonModel; section: SectionModel } | null;
    onLessonClick: (lesson: LessonModel, section: SectionModel) => void;
    onToggleComplete: (lessonId: number) => void;
    completedLessons: Set<number>;
}

export const VideoLesson: React.FC<VideoLessonProps> = ({
    currentLesson,
    currentSection,
    activeTab,
    onTabChange,
    nextLesson,
    onLessonClick,
    onToggleComplete,
    completedLessons,
}) => {
    const [showWarning, setShowWarning] = useState(false);
    const playerRef = useRef<YouTubePlayer | null>(null);
    const lastTimeRef = useRef(0);

    const { handlePlay, handlePause, initialWatchedSeconds } = useLessonProgress({
        lessonId: currentLesson.lessonId,
        lessonType: LessonType.VIDEO,
        durationSeconds: currentLesson.durationSeconds || 0,
        onComplete: onToggleComplete,
        isAlreadyCompleted: completedLessons.has(currentLesson.lessonId),
        config: {
            videoCompletionPercentage: 25,
            intervalSeconds: 10
        }
    });

    // Seek Detection Logic
    useEffect(() => {
        const checkInterval = setInterval(() => {
            // Check if playerRef.current exists and has getCurrentTime method
            if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                try {
                    const currentTime = playerRef.current.getCurrentTime();
                    const diff = currentTime - lastTimeRef.current;

                    console.log('Seek check:', { currentTime, lastTime: lastTimeRef.current, diff });

                    // If jumped forward more than 2 seconds (allow 1s for normal playback + buffer)
                    if (diff > 2) {
                        console.log('⚠️ Seek detected! Showing warning...');
                        setShowWarning(true);
                        // Hide warning after 3 seconds
                        setTimeout(() => setShowWarning(false), 3000);
                    }
                    lastTimeRef.current = currentTime;
                } catch (e) {
                    console.error('Error checking seek:', e);
                }
            }
        }, 1000);

        return () => {
            clearInterval(checkInterval);
            playerRef.current = null; // Cleanup ref on unmount
        };
    }, []);

    const opts: YouTubeProps['opts'] = React.useMemo(() => ({
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
        },
    }), []);

    const onReady: YouTubeProps['onReady'] = React.useCallback((event: any) => {
        playerRef.current = event.target;
        if (initialWatchedSeconds > 0 && !completedLessons.has(currentLesson.lessonId)) {
            try {
                if (event.target && typeof event.target.seekTo === 'function') {
                    event.target.seekTo(initialWatchedSeconds, true);
                }
            } catch (error) {
                console.warn("Failed to seek video:", error);
            }
        }
    }, [initialWatchedSeconds, currentLesson.lessonId, completedLessons]);

    const onPlayerStateChange: YouTubeProps['onStateChange'] = React.useCallback((event: any) => {
        if (event.data === 1) {
            handlePlay();
        } else if (event.data === 2 || event.data === 0) {
            handlePause();
        }
    }, [handlePlay, handlePause]);

    const getYouTubeVideoId = (url: string) => {
        if (!url) return "";
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : "";
    };

    const videoId = getYouTubeVideoId(currentLesson.youtubeUrl || "");

    return (
        <div className="main-container-learning">
            <div className="video-wrapper-learning">
                <div className="aspect-video-container">
                    {currentLesson.lessonType === LessonType.VIDEO || !currentLesson.lessonType ? (
                        videoId ? (
                            <div className="w-100 h-100" style={{ position: 'relative' }}>
                                <YouTube
                                    key={videoId} // Force re-mount on video change
                                    videoId={videoId}
                                    opts={opts}
                                    className="w-100 h-100"
                                    iframeClassName="w-100 h-100"
                                    onReady={onReady}
                                    onStateChange={onPlayerStateChange}
                                // onPlay/onPause are handled by onStateChange for better consistency
                                />
                                {showWarning && (
                                    <div
                                        className="position-absolute top-0 start-0 w-100 p-3"
                                        style={{
                                            zIndex: 9999,
                                            pointerEvents: 'none'
                                        }}
                                    >
                                        <div
                                            className="alert alert-warning d-flex align-items-center shadow-sm"
                                            role="alert"
                                            style={{
                                                backgroundColor: '#fff3cd',
                                                borderColor: '#ffc107',
                                                color: '#856404',
                                                fontSize: '14px',
                                                padding: '12px 16px',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                            }}
                                        >
                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                            <div>
                                                <strong>Cảnh báo:</strong> Bạn đang tua video quá nhanh! Việc này có thể ảnh hưởng đến việc ghi nhận hoàn thành bài học.
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
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


