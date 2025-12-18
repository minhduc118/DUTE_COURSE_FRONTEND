import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { LessonModel, SectionModel, LessonType } from "../../../../model/CourseModel";

import { useCourseDetail } from "../../../../hooks/useCourseDetail";
import QuizBuilderModal from "./QuizBuilderModal";
import CodingBuilderModal from "./CodingBuilderModal";

interface SectionFormState {
  title: string;
  courseId: number;
  sectionOrder: string;
}

interface LessonFormState {
  title: string;
  sectionId: number;
  lessonOrder: string;
  lessonType: LessonType;
  youtubeUrl: string;
  readingContent: string;
  durationSeconds: string;
  isPreview: boolean;
}

const defaultSectionForm: SectionFormState = {
  title: "",
  courseId: 0,
  sectionOrder: "",
};

const defaultLessonForm: LessonFormState = {
  title: "",
  sectionId: 0,
  lessonOrder: "",
  lessonType: LessonType.VIDEO,
  youtubeUrl: "",
  readingContent: "",
  durationSeconds: "",
  isPreview: false,
};

export default function CourseDetailPage() {
  const { slug } = useParams();
  const slugStr = slug ? String(slug) : undefined;
  const navigate = useNavigate();

  const {
    course,
    loading,
    error,
    addSection,
    editSection,
    removeSection,
    addLesson,
    editLesson,
    removeLesson,
  } = useCourseDetail(slugStr);

  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [sectionForm, setSectionForm] =
    useState<SectionFormState>(defaultSectionForm);
  const [editingSection, setEditingSection] = useState<SectionModel | null>(
    null
  );

  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [lessonForm, setLessonForm] =
    useState<LessonFormState>(defaultLessonForm);
  const [currentSectionForLesson, setCurrentSectionForLesson] =
    useState<SectionModel | null>(null);
  const [editingLesson, setEditingLesson] = useState<LessonModel | null>(null);

  const [sectionToDelete, setSectionToDelete] = useState<SectionModel | null>(
    null
  );
  const [lessonToDelete, setLessonToDelete] = useState<LessonModel | null>(
    null
  );

  // Builder Modal States
  const [showQuizBuilder, setShowQuizBuilder] = useState(false);
  const [showCodingBuilder, setShowCodingBuilder] = useState(false);
  const [currentLessonForBuilder, setCurrentLessonForBuilder] = useState<LessonModel | null>(null);

  const sortedSections = useMemo(() => {
    if (!course?.sections) return [];
    return [...course.sections].sort(
      (a, b) => (a.sectionOrder ?? 0) - (b.sectionOrder ?? 0)
    );
  }, [course]);

  const openAddSectionModal = () => {
    setSectionForm({
      title: "",
      courseId: course?.courseId || 0,
      sectionOrder: `${sortedSections.length + 1}`,
    });
    setEditingSection(null);
    setSectionModalOpen(true);
  };

  const openEditSectionModal = (section: SectionModel) => {
    setSectionForm({
      title: section.title || "",
      courseId: section.courseId || 0,
      sectionOrder: section.sectionOrder?.toString() || "",
    });
    setEditingSection(section);
    setSectionModalOpen(true);
  };

  const handleSectionFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionForm.title.trim() || !sectionForm.sectionOrder) return;
    const payload = {
      title: sectionForm.title.trim(),
      sectionOrder: Number(sectionForm.sectionOrder),
    };
    if (editingSection?.sectionId) {
      await editSection(editingSection.sectionId, payload);
    } else {
      await addSection(payload);
    }
    setSectionModalOpen(false);
    setEditingSection(null);
    setSectionForm(defaultSectionForm);
  };

  const openAddLessonModal = (section: SectionModel) => {
    setCurrentSectionForLesson(section);
    setLessonForm({
      title: "",
      sectionId: section.sectionId,
      lessonOrder: `${(section.lessons?.length || 0) + 1}`,
      lessonType: LessonType.VIDEO,
      youtubeUrl: "",
      readingContent: "",
      durationSeconds: "",
      isPreview: false,
    });
    setEditingLesson(null);
    setLessonModalOpen(true);
  };

  const openEditLessonModal = (section: SectionModel, lesson: LessonModel) => {
    setCurrentSectionForLesson(section);
    setLessonForm({
      title: lesson.title || "",
      sectionId: section.sectionId,
      lessonOrder: lesson.lessonOrder?.toString() || "",
      lessonType: lesson.lessonType || LessonType.VIDEO,
      youtubeUrl: lesson.youtubeUrl || "",
      readingContent: lesson.readingContent || "",
      durationSeconds: lesson.durationSeconds?.toString() || "",
      isPreview: Boolean(lesson.isPreview),
    });
    setEditingLesson(lesson);
    setLessonModalOpen(true);
  };

  const handleLessonFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.title.trim() || !lessonForm.lessonOrder) {
      return;
    }

    // Validate required fields based on Type
    if (lessonForm.lessonType === LessonType.VIDEO && !lessonForm.youtubeUrl.trim()) {
      alert("Video URL is required for Video lessons.");
      return;
    }
    if (lessonForm.lessonType === LessonType.READING && !lessonForm.readingContent.trim()) {
      alert("Content is required for Reading lessons.");
      return;
    }

    const payload = {
      title: lessonForm.title.trim(),
      sectionId: currentSectionForLesson?.sectionId || 0,
      lessonOrder: Number(lessonForm.lessonOrder),
      lessonType: lessonForm.lessonType,
      youtubeUrl: lessonForm.lessonType === LessonType.VIDEO ? lessonForm.youtubeUrl.trim() : undefined,
      readingContent: lessonForm.lessonType === LessonType.READING ? lessonForm.readingContent.trim() : undefined,
      durationSeconds: lessonForm.durationSeconds
        ? Number(lessonForm.durationSeconds)
        : undefined,
      courseId: course?.courseId,
      isPreview: lessonForm.isPreview,
    };

    if (editingLesson?.lessonId) {
      await editLesson(editingLesson.lessonId, payload);
    } else if (currentSectionForLesson?.sectionId) {
      await addLesson(currentSectionForLesson.sectionId, payload);
    }

    setLessonModalOpen(false);
    setEditingLesson(null);
    setCurrentSectionForLesson(null);
    setLessonForm(defaultLessonForm);
  };

  const openBuilder = (lesson: LessonModel) => {
    setCurrentLessonForBuilder(lesson);
    console.log("open builder", lesson);
    if (lesson.lessonType === LessonType.QUIZ) {
      setShowQuizBuilder(true);
    } else if (lesson.lessonType === LessonType.CODING) {
      setShowCodingBuilder(true);
    }
  };

  const renderLessonBadge = (lesson: LessonModel) => {
    if (lesson.isPreview) {
      return <span className="badge bg-info text-dark ms-2">Preview</span>;
    }
    return null;
  };

  const renderLessonTypeIcon = (type: LessonType) => {
    switch (type) {
      case LessonType.VIDEO: return <i className="bi bi-play-circle-fill text-primary" title="Video"></i>;
      case LessonType.READING: return <i className="bi bi-file-text-fill text-info" title="Reading"></i>;
      case LessonType.QUIZ: return <i className="bi bi-question-circle-fill text-warning" title="Quiz"></i>;
      case LessonType.CODING: return <i className="bi bi-terminal-fill text-success" title="Coding"></i>;
      default: return <i className="bi bi-play-circle-fill"></i>;
    }
  };

  if (loading && !course) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="text-muted mt-3">Loading course detail...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-5 text-center">
        <p className="text-danger mb-3">
          {error || "Course not found or unavailable."}
        </p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-2" />
          Back
        </button>
      </div>
    );
  }

  const thumbnailSrc = course.thumbnailBase64
    ? course.thumbnailBase64.startsWith("data:")
      ? course.thumbnailBase64
      : `data:image/png;base64,${course.thumbnailBase64}`
    : null;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-link text-decoration-none"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-2" />
            Back
          </button>
          <h2 className="mb-0">Course Detail</h2>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body row g-4">
          <div className="col-md-4">
            {thumbnailSrc ? (
              <img
                src={thumbnailSrc}
                alt={course.title}
                className="img-fluid rounded"
                style={{ maxHeight: "260px", objectFit: "cover" }}
              />
            ) : (
              <div className="bg-light border rounded d-flex align-items-center justify-content-center h-100">
                <span className="text-muted">No thumbnail</span>
              </div>
            )}
          </div>
          <div className="col-md-8">
            <h3 className="fw-bold">{course.title}</h3>
            <p className="text-muted mb-1">
              <i className="bi bi-link-45deg me-1" />
              {course.slug}
            </p>
            <p className="text-muted">
              {course.description || "No description"}
            </p>
            <div className="mb-3">
              <h6 className="text-muted">Introduction</h6>
              <p className="text-muted" style={{ whiteSpace: "pre-line" }}>
                {course.introduction || "No introduction"}
              </p>
            </div>
            <div className="mb-3">
              <h6 className="text-muted">Price</h6>
              {course.discountPrice && course.discountPrice < course.price ? (
                <div>
                  <p className="fs-5 fw-semibold text-danger mb-1">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(course.discountPrice)}
                  </p>
                  <p className="text-muted text-decoration-line-through mb-0">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(course.price)}
                  </p>
                </div>
              ) : (
                <p className="fs-5 fw-semibold text-primary mb-0">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(course.price)}
                </p>
              )}
            </div>
            <div className="d-flex gap-3">
              <div>
                <h6 className="text-muted mb-1">Status</h6>
                <span className="badge bg-primary">{course.status}</span>
              </div>
              <div>
                <h6 className="text-muted mb-1">Created At</h6>
                <p className="mb-0">
                  <i className="bi bi-calendar-event me-1" />
                  {course.createdAt?.slice(0, 10)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Sections & Lessons</h4>
        <button className="btn btn-primary" onClick={openAddSectionModal}>
          <i className="bi bi-plus-circle me-2" />
          Add Section
        </button>
      </div>

      {sortedSections.length === 0 && (
        <div className="alert alert-info">
          No sections yet. Start by adding one.
        </div>
      )}

      {sortedSections.map((section) => {
        const lessons = [...(section.lessons || [])].sort(
          (a, b) => (a.lessonOrder ?? 0) - (b.lessonOrder ?? 0)
        );
        return (
          <div className="card mb-3" key={section.sectionId}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <span className="badge bg-secondary me-2">
                  Order #{section.sectionOrder}
                </span>
                <strong>{section.title}</strong>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={() => openAddLessonModal(section)}
                >
                  <i className="bi bi-plus-circle me-1" />
                  Add Lesson
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => openEditSectionModal(section)}
                >
                  <i className="bi bi-pencil me-1" />
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => setSectionToDelete(section)}
                >
                  <i className="bi bi-trash me-1" />
                  Delete
                </button>
              </div>
            </div>
            <div className="card-body">
              {lessons.length === 0 ? (
                <p className="text-muted mb-0">No lessons in this section.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "60px" }}>Order</th>
                        <th style={{ width: "50px" }}>Type</th>
                        <th>Title</th>
                        <th>Content/URL</th>
                        <th style={{ width: "100px" }}>Duration</th>
                        <th style={{ width: "200px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lessons.map((lesson) => (
                        <tr key={lesson.lessonId}>
                          <td>
                            <span className="badge bg-secondary">
                              #{lesson.lessonOrder}
                            </span>
                          </td>
                          <td className="text-center fs-5">
                            {renderLessonTypeIcon(lesson.lessonType)}
                          </td>
                          <td>
                            {lesson.title}
                            {renderLessonBadge(lesson)}
                          </td>
                          <td>
                            {lesson.lessonType === LessonType.VIDEO ? (
                              <a href={lesson.youtubeUrl} target="_blank" rel="noreferrer" className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                                {lesson.youtubeUrl}
                              </a>
                            ) : lesson.lessonType === LessonType.READING ? (
                              <span className="text-muted fst-italic">Text Content</span>
                            ) : (
                              <span className="text-muted small">Configured via Builder</span>
                            )}
                          </td>
                          <td>
                            {lesson.durationSeconds
                              ? `${lesson.durationSeconds}s`
                              : "null"}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              {(lesson.lessonType === LessonType.QUIZ || lesson.lessonType === LessonType.CODING) && (
                                <button
                                  className="btn btn-sm btn-outline-warning"
                                  onClick={() => openBuilder(lesson)}
                                  title="Configure Content"
                                >
                                  <i className="bi bi-gear-fill" />
                                </button>
                              )}
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() =>
                                  openEditLessonModal(section, lesson)
                                }
                                title="Edit Metadata"
                              >
                                <i className="bi bi-pencil" />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => setLessonToDelete(lesson)}
                                title="Delete Lesson"
                              >
                                <i className="bi bi-trash" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Section Modal */}
      {sectionModalOpen && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingSection ? "Edit Section" : "Add Section"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setSectionModalOpen(false);
                    setEditingSection(null);
                  }}
                />
              </div>
              <form onSubmit={handleSectionFormSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={sectionForm.title}
                      onChange={(e) =>
                        setSectionForm({
                          ...sectionForm,
                          title: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Order *</label>
                    <input
                      type="number"
                      min={1}
                      className="form-control"
                      value={sectionForm.sectionOrder}
                      onChange={(e) =>
                        setSectionForm({
                          ...sectionForm,
                          sectionOrder: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setSectionModalOpen(false);
                      setEditingSection(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check-circle me-2" />
                    {editingSection ? "Update Section" : "Create Section"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {lessonModalOpen && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingLesson ? "Edit Lesson" : "Add Lesson"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setLessonModalOpen(false);
                    setEditingLesson(null);
                    setCurrentSectionForLesson(null);
                  }}
                />
              </div>
              <form onSubmit={handleLessonFormSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Lesson Type *</label>
                    <select
                      className="form-select"
                      value={lessonForm.lessonType}
                      onChange={(e) =>
                        setLessonForm({
                          ...lessonForm,
                          lessonType: e.target.value as LessonType,
                        })
                      }
                      required
                    >
                      <option value={LessonType.VIDEO}>Video</option>
                      <option value={LessonType.READING}>Reading</option>
                      <option value={LessonType.QUIZ}>Quiz</option>
                      <option value={LessonType.CODING}>Coding</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={lessonForm.title}
                      onChange={(e) =>
                        setLessonForm({ ...lessonForm, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Order *</label>
                    <input
                      type="number"
                      min={1}
                      className="form-control"
                      value={lessonForm.lessonOrder}
                      onChange={(e) =>
                        setLessonForm({
                          ...lessonForm,
                          lessonOrder: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Conditional Fields based on Lesson Type */}
                  {lessonForm.lessonType === LessonType.VIDEO && (
                    <div className="mb-3">
                      <label className="form-label">Youtube URL *</label>
                      <input
                        type="url"
                        className="form-control"
                        value={lessonForm.youtubeUrl}
                        onChange={(e) =>
                          setLessonForm({
                            ...lessonForm,
                            youtubeUrl: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  )}

                  {lessonForm.lessonType === LessonType.READING && (
                    <div className="mb-3">
                      <label className="form-label">Reading Content *</label>
                      <textarea
                        className="form-control"
                        rows={6}
                        value={lessonForm.readingContent}
                        onChange={(e) =>
                          setLessonForm({
                            ...lessonForm,
                            readingContent: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  )}

                  {(lessonForm.lessonType === LessonType.VIDEO || lessonForm.lessonType === LessonType.READING) && (
                    <div className="mb-3">
                      <label className="form-label">Duration (seconds)</label>
                      <input
                        type="number"
                        min={0}
                        className="form-control"
                        value={lessonForm.durationSeconds}
                        onChange={(e) =>
                          setLessonForm({
                            ...lessonForm,
                            durationSeconds: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}

                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="lessonPreviewSwitch"
                      checked={lessonForm.isPreview}
                      onChange={(e) =>
                        setLessonForm({
                          ...lessonForm,
                          isPreview: e.target.checked,
                        })
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="lessonPreviewSwitch"
                    >
                      Mark as preview lesson
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setLessonModalOpen(false);
                      setEditingLesson(null);
                      setCurrentSectionForLesson(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check-circle me-2" />
                    {editingLesson ? "Update Lesson" : "Create Lesson"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Section Modal */}
      {sectionToDelete && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Delete Section</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSectionToDelete(null)}
                />
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete section{" "}
                  <strong>{sectionToDelete.title}</strong>?
                </p>
                <p className="text-muted mb-0">
                  All lessons belonging to this section will also be removed.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSectionToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={async () => {
                    if (sectionToDelete?.sectionId) {
                      await removeSection(sectionToDelete.sectionId);
                    }
                    setSectionToDelete(null);
                  }}
                >
                  <i className="bi bi-trash me-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Lesson Modal */}
      {lessonToDelete && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Delete Lesson</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setLessonToDelete(null)}
                />
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete lesson{" "}
                  <strong>{lessonToDelete.title}</strong>?
                </p>
                <p className="text-muted mb-0">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setLessonToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={async () => {
                    if (lessonToDelete?.lessonId) {
                      await removeLesson(lessonToDelete.lessonId);
                    }
                    setLessonToDelete(null);
                  }}
                >
                  <i className="bi bi-trash me-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Quiz Builder Modal */}
      {showQuizBuilder && currentLessonForBuilder && (
        <QuizBuilderModal
          lesson={currentLessonForBuilder}
          onClose={() => {
            setShowQuizBuilder(false);
            setCurrentLessonForBuilder(null);
          }}
          onSuccess={() => {
            // Optionally refresh course data or show success message
            alert("Quiz saved successfully!");
          }}
        />
      )}

      {/* Coding Builder Modal */}
      {showCodingBuilder && currentLessonForBuilder && (
        <CodingBuilderModal
          lesson={currentLessonForBuilder}
          onClose={() => {
            setShowCodingBuilder(false);
            setCurrentLessonForBuilder(null);
          }}
          onSuccess={() => {
            alert("Coding exercise saved successfully!");
          }}
        />
      )}
    </div>
  );
}
