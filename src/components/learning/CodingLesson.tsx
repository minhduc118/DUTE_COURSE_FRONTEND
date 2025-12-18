import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { LessonModel, CourseModel, SectionModel } from "../../model/CourseModel";

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
    const [code, setCode] = useState(`def fizzBuzz(n):
    """
    :type n: int
    :rtype: List[str]
    """
    # Write your solution here
    result = []
    for i in range(1, n + 1):
        if i % 3 == 0 and i % 5 == 0:
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(str(i))
    return result`);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        // In real app, this would revert to the starter code for that language
        if (newLang === 'java') {
            setCode(`class Solution {
    public List<String> fizzBuzz(int n) {
        // Write your code here
        return new ArrayList<>();
    }
}`);
        } else if (newLang === 'python') {
            setCode(`def fizzBuzz(n):
    """
    :type n: int
    :rtype: List[str]
    """
    # Write your solution here
    pass`);
        } else if (newLang === 'cpp') {
            setCode(`class Solution {
public:
    vector<string> fizzBuzz(int n) {
        // Write top-notch C++ code
    }
};`);
        }
    };

    return (
        <div className="coding-lesson-view">
            <div className="coding-layout">
                {/* Left Panel: Instructions */}
                <div className="coding-panel-left">
                    <div className="coding-header-sticky">
                        <div className="coding-title-row">
                            <h1 className="coding-title">FizzBuzz Challenge</h1>
                            <span className="coding-difficulty-badge">Medium</span>
                        </div>
                        <p className="coding-meta">
                            <i className="bi bi-clock"></i> 15 mins
                            <span className="coding-dot">•</span>
                            <i className="bi bi-bar-chart"></i> 450 users solved
                        </p>
                    </div>

                    <div className="coding-content-scroll">
                        <div className="coding-prose">
                            <p>
                                Write a program that prints the numbers from <code className="code-pill">1</code> to <code className="code-pill">100</code>. But for multiples of three print "Fizz" instead of the number and for the multiples of five print "Buzz". For numbers which are multiples of both three and five print "FizzBuzz".
                            </p>

                            <h3>Example Input/Output</h3>
                            <div className="example-box">
                                <div className="example-row">
                                    <div className="example-label">Input:</div>
                                    <div className="example-value">n = 15</div>
                                </div>
                                <div className="example-row mt-2">
                                    <div className="example-label">Output:</div>
                                    <div className="example-val-success">
                                        ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]
                                    </div>
                                </div>
                            </div>

                            <h3>Constraints</h3>
                            <ul className="coding-list">
                                <li>The input <code className="code-pill">n</code> will be a positive integer.</li>
                                <li>1 &lt;= n &lt;= 100</li>
                            </ul>
                        </div>

                        <div className="coding-hint-box">
                            <details className="coding-details">
                                <summary className="coding-summary">
                                    <span className="hint-label">
                                        <i className="bi bi-lightbulb-fill text-warning"></i> Hint 1
                                    </span>
                                    <i className="bi bi-chevron-down"></i>
                                </summary>
                                <div className="hint-content">
                                    Check the divisibility using the modulo operator (%). For example, <code>number % 3 == 0</code> checks if a number is divisible by 3.
                                </div>
                            </details>
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
                                <option value="python">Python 3.10</option>
                                <option value="java">Java 17</option>
                                <option value="cpp">C++ 20</option>
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
