import React, { useState, useEffect } from "react";
import { LessonModel, CourseModel, SectionModel } from "../../model/CourseModel";

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
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default

    // Timer logic
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Full Mock Quiz Data
    const mockQuestions = [
        {
            id: 1,
            number: 1,
            content: "JavaScript is a ___ language?",
            code: null,
            options: [
                { id: "A", text: "Object-Oriented", subtext: "" },
                { id: "B", text: "Object-Based", subtext: "" },
                { id: "C", text: "Procedural", subtext: "" },
                { id: "D", text: "None of the above", subtext: "" }
            ]
        },
        {
            id: 2,
            number: 2,
            content: "Which of the following keywords is used to define a variable in Javascript?",
            code: null,
            options: [
                { id: "A", text: "var", subtext: "" },
                { id: "B", text: "let", subtext: "" },
                { id: "C", text: "Both A and B", subtext: "" },
                { id: "D", text: "None of the above", subtext: "" }
            ]
        },
        {
            id: 3,
            number: 3,
            content: "Consider the following code snippet. What will be the output logged to the console when this function is executed?",
            code: `function checkScope() {
  var i = "function scope";
  if (true) {
    let i = "block scope";
    console.log("Block i: ", i);
  }
  console.log("Function i: ", i);
}
checkScope();`,
            options: [
                { id: "A", text: "Block i: function scope, Function i: block scope", subtext: "Variables declared with var ignore block scope." },
                { id: "B", text: "Block i: block scope, Function i: function scope", subtext: "Variables declared with let are block-scoped." },
                { id: "C", text: "Block i: block scope, Function i: block scope", subtext: "" },
                { id: "D", text: "Syntax Error", subtext: "You cannot redeclare variable i in the same scope." }
            ]
        },
        {
            id: 4,
            number: 4,
            content: "What will be the output of the following code snippet?",
            code: `(function(){
  setTimeout(()=> console.log(1),2000);
  console.log(2);
  setTimeout(()=> console.log(3),0);
  console.log(4);
})();`,
            options: [
                { id: "A", text: "1 2 3 4", subtext: "" },
                { id: "B", text: "2 4 3 1", subtext: "Event Loop mechanism." },
                { id: "C", text: "2 4 1 3", subtext: "" },
                { id: "D", text: "2 1 4 3", subtext: "" }
            ]
        }
    ];

    const currentQuestion = mockQuestions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === mockQuestions.length - 1;

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
                            Question {currentQuestion.number} <span className="quiz-total-count">of {mockQuestions.length}</span>
                        </h2>
                    </div>
                    <div className="quiz-timer-box">
                        <i className="bi bi-stopwatch"></i>
                        <span className="timer-countdown">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="quiz-progress-track">
                    <div className="quiz-progress-fill" style={{ width: `${((currentQuestionIndex + 1) / mockQuestions.length) * 100}%` }}></div>
                </div>

                {/* Question Content */}
                <div className="quiz-main-content">
                    <p className="quiz-question-text">{currentQuestion.content}</p>

                    {currentQuestion.code && (
                        <div className="quiz-code-block">
                            <div className="code-block-header">
                                <span className="code-lang">javascript</span>
                                <button className="code-copy-mini"><i className="bi bi-clipboard"></i> Copy</button>
                            </div>
                            <pre className="code-block-body"><code>{currentQuestion.code}</code></pre>
                        </div>
                    )}

                    {/* Options Grid */}
                    <div className="quiz-options-grid">
                        {currentQuestion.options.map((opt) => (
                            <label key={opt.id} className={`quiz-option-card ${selectedOption === opt.id ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="quiz_answer"
                                    className="d-none"
                                    value={opt.id}
                                    checked={selectedOption === opt.id}
                                    onChange={() => setSelectedOption(opt.id)}
                                />
                                <div className="option-indicator">
                                    <div className="indicator-inner"></div>
                                </div>
                                <div className="option-content">
                                    <span className="option-text">{opt.text}</span>
                                    {opt.subtext && <span className="option-subtext">{opt.subtext}</span>}
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
