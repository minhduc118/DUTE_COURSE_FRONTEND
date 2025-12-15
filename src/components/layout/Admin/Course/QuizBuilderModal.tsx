import React, { useEffect, useState } from "react";
import { LessonModel, QuizRequest, QuestionRequest, OptionRequest } from "../../../../model/CourseModel";
import { createQuiz, getQuizByLessonId } from "../../../../api/QuizAPI";

interface QuizBuilderModalProps {
    lesson: LessonModel;
    onClose: () => void;
    onSuccess: () => void;
}

const defaultOption: OptionRequest = { content: "", isCorrect: false };
const defaultQuestion: QuestionRequest = {
    content: "",
    options: [
        { ...defaultOption, content: "Option A", isCorrect: true },
        { ...defaultOption, content: "Option B", isCorrect: false },
    ],
};
const defaultQuiz: QuizRequest = {
    title: "",
    questions: [defaultQuestion],
    timeLimitSeconds: 600, // 10 mins
    passingScore: 5,
    maxAttempts: 3,
};

export default function QuizBuilderModal({ lesson, onClose, onSuccess }: QuizBuilderModalProps) {
    const [quizForm, setQuizForm] = useState<QuizRequest>(defaultQuiz);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        // Load existing quiz data if any
        const loadQuiz = async () => {
            try {
                const data = await getQuizByLessonId(lesson.lessonId);
                if (data) {
                    setQuizForm(data);
                } else {
                    // If no quiz, pre-fill title with lesson title
                    setQuizForm(prev => ({ ...prev, title: lesson.title }));
                }
            } catch (error) {
                console.error("Error loading quiz:", error);
            } finally {
                setFetching(false);
            }
        };
        loadQuiz();
    }, [lesson]);

    const handleQuizChange = (field: keyof QuizRequest, value: any) => {
        setQuizForm({ ...quizForm, [field]: value });
    };

    const handleQuestionChange = (qIndex: number, field: keyof QuestionRequest, value: any) => {
        const updatedQuestions = [...quizForm.questions];
        updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], [field]: value };
        setQuizForm({ ...quizForm, questions: updatedQuestions });
    };

    const handleOptionChange = (qIndex: number, oIndex: number, field: keyof OptionRequest, value: any) => {
        const updatedQuestions = [...quizForm.questions];
        const updatedOptions = [...updatedQuestions[qIndex].options];
        updatedOptions[oIndex] = { ...updatedOptions[oIndex], [field]: value };
        updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], options: updatedOptions };
        setQuizForm({ ...quizForm, questions: updatedQuestions });
    };

    const addQuestion = () => {
        setQuizForm({
            ...quizForm,
            questions: [...quizForm.questions, {
                ...defaultQuestion, options: [
                    { content: "", isCorrect: true },
                    { content: "", isCorrect: false }
                ]
            }],
        });
    };

    const removeQuestion = (index: number) => {
        const updatedQuestions = quizForm.questions.filter((_, i) => i !== index);
        setQuizForm({ ...quizForm, questions: updatedQuestions });
    };

    const addOption = (qIndex: number) => {
        const updatedQuestions = [...quizForm.questions];
        updatedQuestions[qIndex].options.push({ content: "", isCorrect: false });
        setQuizForm({ ...quizForm, questions: updatedQuestions });
    };

    const removeOption = (qIndex: number, oIndex: number) => {
        const updatedQuestions = [...quizForm.questions];
        updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter((_, i) => i !== oIndex);
        setQuizForm({ ...quizForm, questions: updatedQuestions });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createQuiz(lesson.lessonId, quizForm);
            onSuccess();
            onClose();
        } catch (error: any) {
            alert(error.message || "Failed to save quiz");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-body text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">Quiz Builder: {lesson.title}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose} />
                    </div>
                    <div className="modal-body">
                        <form id="quizForm" onSubmit={handleSubmit}>
                            {/* Quiz Metadata */}
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Quiz Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={quizForm.title}
                                            onChange={(e) => handleQuizChange("title", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="row">
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">Time Limit (s)</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={quizForm.timeLimitSeconds}
                                                    onChange={(e) => handleQuizChange("timeLimitSeconds", Number(e.target.value))}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">Passing Score</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={quizForm.passingScore}
                                                    onChange={(e) => handleQuizChange("passingScore", Number(e.target.value))}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">Max Attempts</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={quizForm.maxAttempts}
                                                    onChange={(e) => handleQuizChange("maxAttempts", Number(e.target.value))}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr />
                            <h5 className="mb-3">Questions ({quizForm.questions.length})</h5>

                            {/* Questions List */}
                            {quizForm.questions.map((q, qIndex) => (
                                <div key={qIndex} className="card mb-3 border-primary">
                                    <div className="card-header d-flex justify-content-between align-items-center bg-light">
                                        <strong>Question {qIndex + 1}</strong>
                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeQuestion(qIndex)}>
                                            <i className="bi bi-trash"></i> Remove
                                        </button>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <label className="form-label">Question Text</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={q.content}
                                                onChange={(e) => handleQuestionChange(qIndex, "content", e.target.value)}
                                                required
                                                placeholder="e.g., What is 2 + 2?"
                                            />
                                        </div>

                                        <label className="form-label">Options</label>
                                        {q.options.map((opt, oIndex) => (
                                            <div key={oIndex} className="input-group mb-2">
                                                <div className="input-group-text">
                                                    <input
                                                        className="form-check-input mt-0"
                                                        type="checkbox"
                                                        checked={opt.isCorrect}
                                                        onChange={(e) => handleOptionChange(qIndex, oIndex, "isCorrect", e.target.checked)}
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={opt.content}
                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, "content", e.target.value)}
                                                    required
                                                    placeholder={`Option ${oIndex + 1}`}
                                                />
                                                <button type="button" className="btn btn-outline-secondary" onClick={() => removeOption(qIndex, oIndex)}>
                                                    <i className="bi bi-x"></i>
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" className="btn btn-sm btn-link text-decoration-none p-0" onClick={() => addOption(qIndex)}>
                                            + Add Option
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button type="button" className="btn btn-outline-primary w-100 py-2 border-dashed" onClick={addQuestion}>
                                <i className="bi bi-plus-circle me-2"></i> Add New Question
                            </button>

                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" form="quizForm" className="btn btn-primary" disabled={loading}>
                            {loading ? "Saving..." : "Save Quiz Configuration"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
