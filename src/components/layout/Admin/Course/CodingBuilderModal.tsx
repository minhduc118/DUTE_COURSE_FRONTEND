import React, { useEffect, useState } from "react";
import { LessonModel, CodingExerciseRequest, TestCaseRequest } from "../../../../model/CourseModel";
import { createCodingExercise, getCodingExerciseByLessonId, updateCodingExercise } from "../../../../api/CodingAPI";

interface CodingBuilderModalProps {
    lesson: LessonModel;
    onClose: () => void;
    onSuccess: () => void;
}

export type ProgrammingLanguage =
    | "C"
    | "JAVA"
    | "JAVASCRIPT"
    | "CSHARP"
    | "SQLSERVER";

const STARTER_TEMPLATES: Record<ProgrammingLanguage, string> = {
    C: `#include <stdio.h>

int main() {
    // Your code here
    return 0;
}`,

    JAVA: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}`,

    JAVASCRIPT: `function solve() {
    // Your code here
}

solve();`,

    CSHARP: `using System;

class Solution {
    static void Main() {
        // Your code here
    }
}`,

    SQLSERVER: `-- Write your SQL Server query here
SELECT * 
FROM your_table;`
};

const defaultTestCase: TestCaseRequest = { input: "", expectedOutput: "", isHidden: false, testOrder: 0 };
const defaultCoding: CodingExerciseRequest = {
    title: "",
    problemStatement: "",
    language: "JAVA",
    starterCode: STARTER_TEMPLATES["JAVA"],
    testCases: [
        { ...defaultTestCase, input: "1 2", expectedOutput: "3", isHidden: false, testOrder: 1 },
    ],
};

export default function CodingBuilderModal({ lesson, onClose, onSuccess }: CodingBuilderModalProps) {
    const [codingForm, setCodingForm] = useState<CodingExerciseRequest>(defaultCoding);
    const [exerciseId, setExerciseId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (lesson.codingExerciseId) {
            const loadCoding = async () => {
                try {
                    const data = await getCodingExerciseByLessonId(lesson.lessonId);
                    console.log("Load lesson details", data);
                    if (data) {
                        setCodingForm(data);
                        if (data.exerciseId) {
                            setExerciseId(data.exerciseId);
                        }
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
        } else {
            setCodingForm(prev => ({ ...prev, title: lesson.title }));
            setFetching(false);
        }

    }, [lesson]);

    const handleFormChange = (field: keyof CodingExerciseRequest, value: any) => {
        setCodingForm({ ...codingForm, [field]: value });
    };

    const handleLanguageChange = (newLanguage: string) => {
        const lang = newLanguage as ProgrammingLanguage;
        setCodingForm({
            ...codingForm,
            language: lang,
            starterCode: STARTER_TEMPLATES[lang] || ""
        });
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
            // Assign testOrder to each test case based on its index
            const payload = {
                ...codingForm,
                testCases: codingForm.testCases.map((tc, index) => ({
                    ...tc,
                    testOrder: index + 1 // 1-based index
                }))
            };

            if (exerciseId) {
                await updateCodingExercise(exerciseId, payload);
            } else {
                await createCodingExercise(lesson.lessonId, payload);
            }
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
                                        <label className="form-label">Problem Statement</label>
                                        <textarea
                                            className="form-control font-monospace"
                                            rows={8}
                                            value={codingForm.problemStatement}
                                            onChange={(e) => handleFormChange("problemStatement", e.target.value)}
                                            required
                                            placeholder="Describe the problem..."
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Programming Language</label>
                                        <select
                                            className="form-select"
                                            value={codingForm.language}
                                            onChange={(e) => handleLanguageChange(e.target.value)}
                                        >
                                            <option value="JAVA">Java</option>
                                            <option value="C">C</option>
                                            <option value="JAVASCRIPT">JavaScript</option>
                                            <option value="CSHARP">C#</option>
                                            <option value="SQLSERVER">SQL Server</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Starter Code ({codingForm.language})</label>
                                        <textarea
                                            className="form-control font-monospace bg-dark text-light"
                                            rows={10}
                                            value={codingForm.starterCode}
                                            onChange={(e) => handleFormChange("starterCode", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Instructions (Optional)</label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            value={codingForm.instructions || ""}
                                            onChange={(e) => handleFormChange("instructions", e.target.value)}
                                            placeholder="Specific constraints or hints..."
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Time Limit (Seconds)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={codingForm.timeLimitSeconds || ""}
                                            onChange={(e) => handleFormChange("timeLimitSeconds", Number(e.target.value))}
                                            placeholder="e.g., 2"
                                            min={1}
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
                                                        required
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
