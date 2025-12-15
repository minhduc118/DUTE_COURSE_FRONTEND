import React, { useEffect, useState } from "react";
import { LessonModel, CodingExerciseRequest, TestCaseRequest } from "../../../../model/CourseModel";
import { createCodingExercise, getCodingExerciseByLessonId } from "../../../../api/CodingAPI";

interface CodingBuilderModalProps {
    lesson: LessonModel;
    onClose: () => void;
    onSuccess: () => void;
}

const defaultTestCase: TestCaseRequest = { input: "", expectedOutput: "", isHidden: false };
const defaultCoding: CodingExerciseRequest = {
    title: "",
    problemStatement: "",
    language: "JAVA", // Default to JAVA as per requirement
    starterCode: "public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}",
    testCases: [
        { ...defaultTestCase, input: "1 2", expectedOutput: "3", isHidden: false },
    ],
};

export default function CodingBuilderModal({ lesson, onClose, onSuccess }: CodingBuilderModalProps) {
    const [codingForm, setCodingForm] = useState<CodingExerciseRequest>(defaultCoding);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const loadCoding = async () => {
            try {
                const data = await getCodingExerciseByLessonId(lesson.lessonId);
                if (data) {
                    setCodingForm(data);
                } else {
                    setCodingForm(prev => ({ ...prev, title: lesson.title }));
                }
            } catch (error) {
                console.error("Error loading coding exercise:", error);
            } finally {
                setFetching(false);
            }
        };
        loadCoding();
    }, [lesson]);

    const handleFormChange = (field: keyof CodingExerciseRequest, value: any) => {
        setCodingForm({ ...codingForm, [field]: value });
    };

    const handleTestCaseChange = (index: number, field: keyof TestCaseRequest, value: any) => {
        const updatedTestCases = [...codingForm.testCases];
        updatedTestCases[index] = { ...updatedTestCases[index], [field]: value };
        setCodingForm({ ...codingForm, testCases: updatedTestCases });
    };

    const addTestCase = () => {
        setCodingForm({
            ...codingForm,
            testCases: [...codingForm.testCases, { ...defaultTestCase }],
        });
    };

    const removeTestCase = (index: number) => {
        const updatedTestCases = codingForm.testCases.filter((_, i) => i !== index);
        setCodingForm({ ...codingForm, testCases: updatedTestCases });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createCodingExercise(lesson.lessonId, codingForm);
            onSuccess();
            onClose();
        } catch (error: any) {
            alert(error.message || "Failed to save coding exercise");
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
                            <div className="spinner-border text-success" role="status"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-fullscreen-lg-down modal-xl modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header bg-success text-white">
                        <h5 className="modal-title">Coding Problem Creator: {lesson.title}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose} />
                    </div>
                    <div className="modal-body">
                        <form id="codingForm" onSubmit={handleSubmit}>
                            <div className="row g-4">
                                {/* Left Column: Problem Details */}
                                <div className="col-lg-6">
                                    <div className="mb-3">
                                        <label className="form-label">Problem Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={codingForm.title}
                                            onChange={(e) => handleFormChange("title", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Problem Statement (HTML/Markdown support planned)</label>
                                        <textarea
                                            className="form-control font-monospace"
                                            rows={10}
                                            value={codingForm.problemStatement}
                                            onChange={(e) => handleFormChange("problemStatement", e.target.value)}
                                            required
                                            placeholder="Describe the problem..."
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Review Starter Code (JAVA)</label>
                                        <textarea
                                            className="form-control font-monospace bg-dark text-light"
                                            rows={10}
                                            value={codingForm.starterCode}
                                            onChange={(e) => handleFormChange("starterCode", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Right Column: Test Cases */}
                                <div className="col-lg-6">
                                    <h5 className="mb-3">Test Cases ({codingForm.testCases.length})</h5>
                                    <div className="alert alert-info py-2 small">
                                        <i className="bi bi-info-circle me-1"></i>
                                        Hidden test cases are used for grading and not shown to students.
                                    </div>

                                    {codingForm.testCases.map((tc, index) => (
                                        <div key={index} className="card mb-3 border-success">
                                            <div className="card-header d-flex justify-content-between align-items-center bg-light">
                                                <strong>Test Case #{index + 1}</strong>
                                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeTestCase(index)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                            <div className="card-body">
                                                <div className="mb-2">
                                                    <label className="form-label small text-muted">Input</label>
                                                    <textarea
                                                        className="form-control font-monospace"
                                                        rows={2}
                                                        value={tc.input}
                                                        onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                                                        required // Assuming input can be empty string in some cases, but usually not. Let's keep required.
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <label className="form-label small text-muted">Expected Output</label>
                                                    <textarea
                                                        className="form-control font-monospace"
                                                        rows={2}
                                                        value={tc.expectedOutput}
                                                        onChange={(e) => handleTestCaseChange(index, "expectedOutput", e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`isHidden-${index}`}
                                                        checked={tc.isHidden}
                                                        onChange={(e) => handleTestCaseChange(index, "isHidden", e.target.checked)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`isHidden-${index}`}>
                                                        Hidden Test Case
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button type="button" className="btn btn-outline-success w-100 border-dashed" onClick={addTestCase}>
                                        <i className="bi bi-plus-circle me-2"></i> Add Test Case
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" form="codingForm" className="btn btn-success" disabled={loading}>
                            {loading ? "Saving..." : "Save Coding Exercise"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
