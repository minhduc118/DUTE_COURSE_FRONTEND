import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { LessonModel, CourseModel, SectionModel } from "../../model/CourseModel";
import { getCodingExerciseByLessonId } from "../../api/CodingAPI";
import { CodingExerciseResponse } from "../../model/CourseModel";

interface CodingLessonProps {
    currentLesson: LessonModel;
    course: CourseModel;
    currentSection: SectionModel | null;
    onToggleComplete: (lessonId: number) => void;
    prevLesson: { lesson: LessonModel; section: SectionModel } | null;
    nextLesson: { lesson: LessonModel; section: SectionModel } | null;
    onLessonClick: (lesson: LessonModel, section: SectionModel) => void;
}

export const CodingLesson: React.FC<CodingLessonProps> = ({
    currentLesson,
    onToggleComplete
}) => {
    const [activeTab, setActiveTab] = useState<'test' | 'console'>('test');
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState("");
    const [exercise, setExercise] = useState<CodingExerciseResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExercise = async () => {
            if (!currentLesson?.lessonId) return;
            try {
                setLoading(true);
                const data = await getCodingExerciseByLessonId(currentLesson.lessonId);
                setExercise(data);
                if (data) {
                    setLanguage(data.language.toLowerCase());
                    setCode(data.starterCode);
                }
            } catch (error) {
                console.error("Failed to load coding exercise", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExercise();
    }, [currentLesson?.lessonId]);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        // In a real scenario with multiple language support, you would fetch/switch starter code here
    };

    if (loading) return <div className="p-4 text-center text-white">Loading exercise...</div>;
    if (!exercise) return <div className="p-4 text-center text-white">No coding exercise found.</div>;

    return (
        <div className="coding-lesson-view">
            <div className="coding-layout">
                {/* Left Panel: Instructions */}
                <div className="coding-panel-left">
                    <div className="coding-header-sticky">
                        <div className="coding-title-row">
                            <h1 className="coding-title">{exercise.title}</h1>
                            <span className="coding-difficulty-badge">Medium</span>
                        </div>
                        <p className="coding-meta">
                            <i className="bi bi-clock"></i> {exercise.timeLimitSeconds ? Math.floor(exercise.timeLimitSeconds / 60) : 15} mins
                            <span className="coding-dot">•</span>
                            <i className="bi bi-code-slash"></i> {exercise.language}
                        </p>
                    </div>

                    <div className="coding-content-scroll">
                        <div className="coding-prose">
                            <div dangerouslySetInnerHTML={{ __html: exercise.problemStatement }} />

                            {exercise.instructions && (
                                <div className="mt-4">
                                    <h3>Instructions</h3>
                                    <div dangerouslySetInnerHTML={{ __html: exercise.instructions }} />
                                </div>
                            )}

                            {exercise.testCases && exercise.testCases.length > 0 && (
                                <>
                                    <h3>Example</h3>
                                    <div className="example-box">
                                        <div className="example-row">
                                            <div className="example-label">Input:</div>
                                            <div className="example-value">{exercise.testCases[0].input}</div>
                                        </div>
                                        <div className="example-row mt-2">
                                            <div className="example-label">Output:</div>
                                            <div className="example-val-success">
                                                {exercise.testCases[0].expectedOutput}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>


                    </div>
                </div>

                {/* Right Panel: Editor & Console */}
                <div className="coding-panel-right">
                    {/* Editor Toolbar */}
                    <div className="editor-toolbar">
                        <div className="editor-lang-select">
                            <select
                                className="editor-lang-select"
                                value={language}
                                onChange={handleLanguageChange}
                                style={{ background: '#0b0d11', color: 'white', border: '1px solid #282e39' }}
                            >
                                <option value={exercise.language.toLowerCase()}>{exercise.language}</option>
                            </select>
                        </div>
                        <div className="editor-actions">
                            <button className="editor-icon-btn" title="Reset Code"><i className="bi bi-arrow-counterclockwise"></i></button>
                            <button className="editor-icon-btn" title="Full Screen"><i className="bi bi-fullscreen"></i></button>
                        </div>
                    </div>

                    {/* Code Editor Area */}
                    <div className="editor-code-area" style={{ display: 'block', overflow: 'hidden' }}>
                        <Editor
                            height="100%"
                            theme="vs-dark"
                            language={language}
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: "'Fira Code', monospace",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 16, bottom: 16 },
                                lineNumbers: 'on',
                                renderLineHighlight: 'all',
                            }}
                        />
                    </div>

                    {/* Console / Test Results */}
                    <div className="editor-console-section">
                        <div className="console-tabs">
                            <button
                                className={`console-tab ${activeTab === 'test' ? 'active' : ''}`}
                                onClick={() => setActiveTab('test')}
                            >
                                <i className="bi bi-check-circle-fill text-success"></i> Test Results
                            </button>
                            <button
                                className={`console-tab ${activeTab === 'console' ? 'active' : ''}`}
                                onClick={() => setActiveTab('console')}
                            >
                                Console Output
                            </button>
                            <i className="bi bi-chevron-down ml-auto mr-3 cursor-pointer text-secondary"></i>
                        </div>

                        <div className="console-content">
                            {activeTab === 'test' ? (
                                <div className="test-results-view">
                                    <div className="test-cases-list">
                                        <button className="test-case-btn active">Case 1 <i className="bi bi-check"></i></button>
                                        <button className="test-case-btn">Case 2 <i className="bi bi-check opacity-50"></i></button>
                                        <button className="test-case-btn">Case 3 <i className="bi bi-check opacity-50"></i></button>
                                    </div>
                                    <div className="test-case-detail">
                                        <div className="detail-header">Case 1 Details</div>
                                        <div className="detail-grid">
                                            <div className="detail-label">Input:</div>
                                            <div className="detail-val">n = 3</div>
                                            <div className="detail-label">Output:</div>
                                            <div className="detail-val">["1", "2", "Fizz"]</div>
                                            <div className="detail-label">Expected:</div>
                                            <div className="detail-val text-success">["1", "2", "Fizz"]</div>
                                        </div>
                                        <div className="test-status-msg text-success">
                                            <i className="bi bi-check-circle-fill"></i> Test Passed (24ms)
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="console-output-view">
                                    <span className="text-secondary">No output to display.</span>
                                </div>
                            )}
                        </div>

                        {/* Footer Buttons */}
                        <div className="console-footer">
                            <button className="btn-issue">
                                <i className="bi bi-bug"></i> Report
                            </button>
                            <div className="console-actions-right">
                                <button className="btn-run-code">
                                    <i className="bi bi-play-fill"></i> Run Code
                                </button>
                                <button className="btn-submit-code">
                                    <i className="bi bi-cloud-upload"></i> Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
