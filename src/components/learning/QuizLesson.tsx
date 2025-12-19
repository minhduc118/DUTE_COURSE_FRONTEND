import React, { useState, useEffect } from "react";
import { LessonModel, CourseModel, SectionModel } from "../../model/CourseModel";
import { getQuizByLessonId } from "../../api/QuizAPI";

interface QuizLessonProps {
    currentLesson: LessonModel;
    course: CourseModel;
    currentSection: SectionModel | null;
    onToggleComplete: (lessonId: number) => void;
    prevLesson: { lesson: LessonModel; section: SectionModel } | null;
    nextLesson: { lesson: LessonModel; section: SectionModel } | null;
    onLessonClick: (lesson: LessonModel, section: SectionModel) => void;
}

export const QuizLesson: React.FC<QuizLessonProps> = ({
    currentLesson,
    currentSection,
    prevLesson,
    nextLesson,
    onLessonClick,
}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
    const [quizData, setQuizData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    // Timer logic
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!currentLesson?.lessonId) return;
            try {
                setLoading(true);
                const data = await getQuizByLessonId(currentLesson.lessonId);
                setQuizData(data);
            } catch (error) {
                console.error("Failed to load quiz", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [currentLesson?.lessonId]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const questions = quizData?.questions || [];
    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleNext = () => {
        if (!isLastQuestion) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null); // Reset selection for next question
        } else {
            // Handle quiz submission or completion
            console.log("Quiz Submitted");
            // You might want to call onToggleComplete here if this was the real logic
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            setSelectedOption(null);
        }
    };

    if (loading) return <div className="p-4 text-center">Loading quiz...</div>;
    if (!currentQuestion) return <div className="p-4 text-center">No questions found for this quiz.</div>;

    return (
        <div className="quiz-lesson-view">
            <div className="quiz-container-focused">
                {/* Header Info */}
                <div className="quiz-status-bar">
                    <div className="quiz-info-left">
                        <div className="quiz-badges">
                            <span className="quiz-badge-level">Intermediate</span>
                            <span className="quiz-meta-dot">•</span>
                            <span className="quiz-meta-type">Multiple Choice</span>
                        </div>
                        <h2 className="quiz-question-number">
                            Question {currentQuestion.questionOrder} <span className="quiz-total-count">of {questions.length}</span>
                        </h2>
                    </div>
                    <div className="quiz-timer-box">
                        <i className="bi bi-stopwatch"></i>
                        <span className="timer-countdown">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="quiz-progress-track">
                    <div className="quiz-progress-fill" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                </div>

                {/* Question Content */}
                <div className="quiz-main-content">
                    <p className="quiz-question-text">{currentQuestion.questionText}</p>

                    {/* Options Grid */}
                    <div className="quiz-options-grid">
                        {currentQuestion.options?.map((opt: any) => (
                            <label key={opt.optionId} className={`quiz-option-card ${selectedOption === opt.optionId ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="quiz_answer"
                                    className="d-none"
                                    value={opt.optionId}
                                    checked={selectedOption === opt.optionId}
                                    onChange={() => setSelectedOption(opt.optionId)}
                                />
                                <div className="option-indicator">
                                    <div className="indicator-inner"></div>
                                </div>
                                <div className="option-content">
                                    <span className="option-text">{opt.optionText}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="quiz-footer-actions">
                    <button className="btn-quiz-report">
                        <i className="bi bi-flag"></i> Report Issue
                    </button>
                    <div className="quiz-main-btns">
                        <button
                            className="btn-quiz-skip"
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            style={{
                                opacity: currentQuestionIndex === 0 ? 0.4 : 1,
                                cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                                display: currentQuestionIndex === 0 ? 'none' : 'block'
                            }}
                        >
                            Previous
                        </button>

                        <button className="btn-quiz-submit" onClick={handleNext}>
                            {isLastQuestion ? "Submit Quiz" : "Next Question"}
                            <i className={`bi ${isLastQuestion ? "bi-check-lg" : "bi-arrow-right"}`}></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
