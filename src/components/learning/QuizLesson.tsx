import React, { useState, useEffect, useCallback, useRef } from "react";
import { LessonModel, CourseModel, SectionModel, QuizStartResponse, QuizAttemptResponse } from "../../model/CourseModel";
import { getQuizByLessonId, startQuizAttempt, submitQuiz } from "../../api/QuizAPI";
import { updateLessonProgress } from "../../api/CourseAPI";

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
    onToggleComplete,
}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [quizData, setQuizData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    // New state for quiz submission
    const [answers, setAnswers] = useState<{ [questionId: number]: number[] }>({});
    const [quizStarted, setQuizStarted] = useState(false);
    const [attemptInfo, setAttemptInfo] = useState<QuizStartResponse | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quizResults, setQuizResults] = useState<QuizAttemptResponse | null>(null);
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasAutoSubmitted = useRef(false);

    // Timer logic - with auto-submit when time runs out
    useEffect(() => {
        if (!quizStarted || timeLeft <= 0 || showResults) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Auto-submit when time runs out
                    if (!hasAutoSubmitted.current) {
                        hasAutoSubmitted.current = true;
                        handleSubmitQuiz(true);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quizStarted, timeLeft, showResults]);

    // Fetch quiz data (not starting the attempt yet)
    useEffect(() => {
        const fetchQuiz = async () => {
            if (!currentLesson?.lessonId) return;
            try {
                setLoading(true);
                const data = await getQuizByLessonId(currentLesson.lessonId);
                console.log("Quiz Data:", data);
                setQuizData(data);
            } catch (error) {
                console.error("Failed to load quiz", error);
                setError("Không thể tải quiz. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();

        // Reset state when lesson changes
        setQuizStarted(false);
        setAttemptInfo(null);
        setAnswers({});
        setQuizResults(null);
        setShowResults(false);
        setError(null);
        hasAutoSubmitted.current = false;
    }, [currentLesson?.lessonId]);


    // Start quiz attempt
    const handleStartQuiz = async () => {
        if (!quizData?.quizId) {
            setError("Quiz ID not found");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const startResponse = await startQuizAttempt(quizData.quizId);
            setAttemptInfo(startResponse);
            setTimeLeft(startResponse.timeLimitSeconds);
            setQuizStarted(true);
            hasAutoSubmitted.current = false;
        } catch (err: any) {
            console.error("Failed to start quiz:", err);
            setError(err.message || "Không thể bắt đầu quiz. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    // Submit quiz answers
    const handleSubmitQuiz = useCallback(async (autoSubmit = false) => {
        if (!attemptInfo?.attemptId) return;
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            // Convert answers to API format
            const answersArray = Object.entries(answers).map(([questionId, selectedOptionIds]) => ({
                questionId: Number(questionId),
                selectedOptionIds
            }));

            const submitResponse = await submitQuiz(attemptInfo.attemptId, {
                answers: answersArray
            });

            setQuizResults(submitResponse);
            setShowResults(true);

            // Update lesson progress
            await updateLessonProgress(currentLesson.lessonId, {
                quizScore: submitResponse.score,
                quizPassed: submitResponse.passed,
                completed: submitResponse.passed
            });

            if (submitResponse.passed) {
                onToggleComplete(currentLesson.lessonId);
            }

            if (autoSubmit) {
                alert("Hết giờ! Quiz đã được tự động nộp.");
            }
        } catch (err: any) {
            console.error("Quiz submission failed:", err);
            setError(err.message || "Không thể nộp bài. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    }, [attemptInfo, answers, currentLesson.lessonId, isSubmitting, onToggleComplete]);

    // Handle option selection
    const handleOptionSelect = (questionId: number, optionId: number) => {
        setSelectedOption(optionId);
        setAnswers(prev => ({
            ...prev,
            [questionId]: [optionId] // Array format for backend
        }));
    };

    // Navigation handlers
    const handleNext = () => {
        if (!isLastQuestion) {
            setCurrentQuestionIndex(prev => prev + 1);
            // Load previously selected answer for next question
            const nextQuestion = questions[currentQuestionIndex + 1];
            const savedAnswer = answers[nextQuestion?.questionId];
            setSelectedOption(savedAnswer?.[0] || null);
        } else {
            // Trigger submit on last question
            handleSubmitQuiz(false);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            // Load previously selected answer for previous question
            const prevQuestion = questions[currentQuestionIndex - 1];
            const savedAnswer = answers[prevQuestion?.questionId];
            setSelectedOption(savedAnswer?.[0] || null);
        }
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const questions = quizData?.questions || [];
    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;


    if (loading) return <div className="p-4 text-center">Loading quiz...</div>;
    if (error) return <div className="p-4 text-center text-danger">{error}</div>;
    if (!quizData) return <div className="p-4 text-center">No quiz found for this lesson.</div>;

    // Show results screen if quiz is submitted
    if (showResults && quizResults) {
        return (
            <div className="quiz-lesson-view">
                <div className="quiz-container-focused">
                    <div className="quiz-results-container p-5 text-center">
                        <h2 className="mb-4">
                            {quizResults.passed ? (
                                <><i className="bi bi-check-circle-fill text-success"></i> Chúc mừng! Bạn đã qua!</>
                            ) : (
                                <><i className="bi bi-x-circle-fill text-danger"></i> Chưa đạt yêu cầu</>
                            )}
                        </h2>
                        <div className="results-stats mb-4">
                            <p><strong>Điểm:</strong> {quizResults.score}%</p>
                            <p><strong>Câu đúng:</strong> {quizResults.correctAnswers}/{quizResults.totalQuestions}</p>
                            <p><strong>Điểm kiếm được:</strong> {quizResults.earnedPoints}/{quizResults.totalPoints}</p>
                            {quizResults.expired && <p className="text-warning">⚠️ Bài nộp sau khi hết giờ</p>}
                        </div>
                        <button className="btn btn-primary" onClick={() => window.location.reload()}>
                            Làm lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show start screen if quiz not started
    if (!quizStarted) {
        return (
            <div className="quiz-lesson-view">
                <div className="quiz-container-focused p-5 text-center">
                    <h2 className="mb-3">{quizData.title || "Quiz"}</h2>
                    <div className="quiz-info mb-4">
                        <p><i className="bi bi-question-circle"></i> <strong>Số câu hỏi:</strong> {questions.length}</p>
                        <p><i className="bi bi-clock"></i> <strong>Thời gian:</strong> {Math.ceil((quizData.timeLimitSeconds || 0) / 60)} phút</p>
                        {quizData.passingScore && <p><i className="bi bi-trophy"></i> <strong>Điểm qua:</strong> {quizData.passingScore}%</p>}
                        {quizData.maxAttempts && <p><i className="bi bi-repeat"></i> <strong>Số lần làm tối đa:</strong> {quizData.maxAttempts}</p>}
                    </div>
                    <button className="btn btn-success btn-lg" onClick={handleStartQuiz}>
                        <i className="bi bi-play-fill"></i> Bắt đầu Quiz
                    </button>
                </div>
            </div>
        );
    }

    // Show quiz questions
    if (!currentQuestion) return <div className="p-4 text-center">No questions found.</div>;

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
                                    onChange={() => handleOptionSelect(currentQuestion.questionId, opt.optionId)}
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
