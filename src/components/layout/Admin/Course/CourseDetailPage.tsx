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

  // --- Render Helpers ---
  const processThumbnail = (thumbnail: string | undefined) => {
    if (!thumbnail) return "https://placehold.co/800x450?text=No+Cover";
    return thumbnail.startsWith("data:")
      ? thumbnail
      : `data:image/png;base64,${thumbnail}`;
  };

  const getLessonIcon = (type: LessonType) => {
    switch (type) {
      case LessonType.VIDEO:
        return <div className="w-8 h-8 rounded-lg bg-red-100 text-danger flex items-center justify-center shrink-0"><i className="bi bi-play-circle-fill fs-5"></i></div>;
      case LessonType.READING:
        return <div className="w-8 h-8 rounded-lg bg-blue-100 text-primary flex items-center justify-center shrink-0"><i className="bi bi-file-text-fill fs-5"></i></div>;
      case LessonType.QUIZ:
        return <div className="w-8 h-8 rounded-lg bg-amber-100 text-warning flex items-center justify-center shrink-0"><i className="bi bi-question-circle-fill fs-5"></i></div>;
      case LessonType.CODING:
        return <div className="w-8 h-8 rounded-lg bg-green-100 text-success flex items-center justify-center shrink-0"><i className="bi bi-terminal-fill fs-5"></i></div>;
      default:
        return <div className="w-8 h-8 rounded-lg bg-gray-100 text-secondary flex items-center justify-center shrink-0"><i className="bi bi-circle-fill fs-5"></i></div>;
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

  return (
    <div className="container-fluid p-0">
      {/* Breadcrumb & Header */}
      <div className="space-y-4 mb-4">
        <div className="d-flex items-center text-sm text-muted">
          <span className="cursor-pointer hover-text-primary" onClick={() => navigate('/admin/dashboard')}>Home</span>
          <i className="bi bi-chevron-right mx-2 text-xs"></i>
          <span className="cursor-pointer hover-text-primary" onClick={() => navigate('/admin/products')}>Courses</span>
          <i className="bi bi-chevron-right mx-2 text-xs"></i>
          <span className="fw-medium text-dark">{course.title}</span>
        </div>

        <div className="d-flex items-center justify-content-between">
          <div className="d-flex items-center gap-3">
            <button
              className="btn btn-light rounded-circle shadow-sm border d-flex align-items-center justify-content-center"
              style={{ width: 40, height: 40 }}
              onClick={() => navigate('/admin/products')}
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            <h1 className="page-title mb-0">Course Detail</h1>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary d-flex align-items-center gap-2 bg-white">
              <i className="bi bi-eye"></i> Preview
            </button>
            <button className="btn-primary-rose d-flex align-items-center gap-2">
              <i className="bi bi-save"></i> Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Course Info Card */}
      <div className="admin-card p-0 overflow-hidden mb-4 border-0 shadow-sm rounded-4">
        <div className="row g-0">
          <div className="col-lg-4 p-4">
            <div className="position-relative w-100 rounded-3 overflow-hidden shadow-sm group" style={{ aspectRatio: '16/9' }}>
              <img
                src={processThumbnail(course.thumbnailBase64)}
                alt={course.title}
                className="w-100 h-100 object-fit-cover"
              />
              <div className="position-absolute bottom-0 start-0 m-3">
                <span className="badge bg-primary shadow-sm">ID: #{course.courseId}</span>
              </div>
            </div>
          </div>
          <div className="col-lg-8 p-4 ps-lg-0 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-3 mb-2">
                <span className="badge bg-success-subtle text-success rounded-pill border border-success-subtle px-3">
                  <span className="dot bg-success me-2 d-inline-block rounded-circle" style={{ width: 6, height: 6 }}></span>
                  Active
                </span>
                <span className="small text-muted d-flex align-items-center gap-1">
                  <i className="bi bi-link-45deg"></i> {course.slug}
                </span>
              </div>
              <h2 className="fw-bold text-dark mb-3">{course.title}</h2>
              <div className="text-muted mb-4" style={{ maxWidth: '800px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {course.description || "No description provided."}
              </div>

              <div className="d-flex flex-wrap gap-4 pt-4 border-top">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-calendar3 fs-5 text-muted"></i>
                  <div>
                    <div className="small text-muted">Created</div>
                    <div className="fw-medium text-dark">{course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-clock fs-5 text-muted"></i>
                  <div>
                    <div className="small text-muted">Duration</div>
                    <div className="fw-medium text-dark">{course.durationInMonths ? `${course.durationInMonths} months` : 'N/A'}</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-person fs-5 text-muted"></i>
                  <div>
                    <div className="small text-muted">Author</div>
                    <div className="fw-medium text-dark">Admin</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 mt-lg-0 d-flex justify-content-end align-items-end">
              <div className="text-end">
                <div className="small text-muted fw-bold text-uppercase mb-1">Price</div>
                <div className="d-flex align-items-baseline gap-2 justify-content-end">
                  <span className="fs-2 fw-bold" style={{ color: 'var(--primary-rose)' }}>{course.price?.toLocaleString()} ₫</span>
                  {course.discountPrice && (
                    <span className="fs-5 text-muted text-decoration-line-through">{course.discountPrice.toLocaleString()} ₫</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Section */}
      <div className="d-flex flex-column gap-4">
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="fs-4 fw-bold text-dark d-flex align-items-center gap-2 m-0">
            <i className="bi bi-layers text-primary"></i> Curriculum
          </h3>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openAddSectionModal}>
            <i className="bi bi-plus-lg"></i> Add Section
          </button>
        </div>

        {sortedSections.length === 0 ? (
          <div className="text-center py-5 border rounded-3 bg-white border-dashed">
            <i className="bi bi-layers text-muted fs-1 mb-3 d-block"></i>
            <h5 className="text-muted">No sections yet</h5>
            <p className="text-muted small">Start building your course curriculum by adding sections.</p>
            <button className="btn btn-outline-primary mt-2" onClick={openAddSectionModal}>
              Add First Section
            </button>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {sortedSections.map((section) => {
              const lessons = [...(section.lessons || [])].sort(
                (a, b) => (a.lessonOrder ?? 0) - (b.lessonOrder ?? 0)
              );
              return (
                <div key={section.sectionId} className="admin-card p-0 border shadow-sm rounded-3 overflow-hidden">
                  {/* Section Header */}
                  <div className="bg-light px-4 py-3 border-bottom d-flex align-items-center justify-content-between group">
                    <div className="d-flex align-items-center gap-3">
                      <i className="bi bi-grip-vertical text-muted cursor-move fs-5"></i>
                      <h5 className="m-0 fw-bold">{section.title}</h5>
                      <span className="badge bg-secondary-subtle text-secondary border">Order #{section.sectionOrder}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <div className="text-muted small me-3">{lessons.length} Lessons</div>
                      <button className="btn btn-sm btn-icon btn-outline-secondary border-0" title="Edit" onClick={() => openEditSectionModal(section)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-icon btn-outline-danger border-0" title="Delete" onClick={() => setSectionToDelete(section)}>
                        <i className="bi bi-trash"></i>
                      </button>
                      <div className="vr mx-2"></div>
                      <button className="btn btn-sm btn-primary-soft text-primary fw-medium" onClick={() => openAddLessonModal(section)}>
                        <i className="bi bi-plus-circle me-1"></i> Add Lesson
                      </button>
                    </div>
                  </div>

                  {/* Lesson List */}
                  <div className="divide-y">
                    {lessons.length === 0 ? (
                      <div className="p-4 text-center text-muted small fst-italic">
                        No lessons in this section. Click "Add Lesson" to create content.
                      </div>
                    ) : (
                      lessons.map((lesson) => (
                        <div key={lesson.lessonId} className="px-4 py-3 d-flex align-items-center justify-content-between hover-bg-light transition-all border-bottom border-light">
                          <div className="d-flex align-items-center gap-4 flex-grow-1">
                            <span className="text-muted font-monospace small" style={{ width: 24 }}>#{lesson.lessonOrder}</span>
                            {getLessonIcon(lesson.lessonType)}
                            <div>
                              <div className="fw-medium text-dark d-flex align-items-center gap-2">
                                {lesson.title}
                                {lesson.isPreview && <span className="badge bg-info-subtle text-info border border-info-subtle text-uppercase" style={{ fontSize: 9 }}>Preview</span>}
                              </div>
                              <div className="small text-muted">
                                {lesson.lessonType === LessonType.VIDEO ? (
                                  <a href={lesson.youtubeUrl} target="_blank" rel="noreferrer" className="text-primary text-decoration-none">
                                    <i className="bi bi-youtube me-1"></i> Video Link
                                  </a>
                                ) : lesson.lessonType === LessonType.READING ? (
                                  <span><i className="bi bi-text-paragraph me-1"></i> Text Content</span>
                                ) : (
                                  <span className="text-warning-emphasis"><i className="bi bi-tools me-1"></i> Interactive Content</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-4">
                            <span className="badge bg-light text-muted border">
                              {lesson.durationSeconds ? `${Math.floor(lesson.durationSeconds / 60)}m ${lesson.durationSeconds % 60}s` : '--'}
                            </span>
                            <div className="d-flex align-items-center gap-1">
                              {(lesson.lessonType === LessonType.QUIZ || lesson.lessonType === LessonType.CODING) && (
                                <button className="btn btn-sm btn-icon text-warning bg-warning-subtle" onClick={() => openBuilder(lesson)} title="Builder">
                                  <i className="bi bi-gear-fill"></i>
                                </button>
                              )}
                              <button className="btn btn-sm btn-icon text-secondary hover-text-primary" onClick={() => openEditLessonModal(section, lesson)} title="Edit">
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button className="btn btn-sm btn-icon text-secondary hover-text-danger" onClick={() => setLessonToDelete(lesson)} title="Delete">
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals remain mostly unchanged in logic but wrapped if needed. 
          The previous implementation of modals was already at the end of the return. 
          I will retain them here.
      */}
      {/* Section Modal */}
      {sectionModalOpen && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {editingSection ? "Edit Section" : "Add New Section"}
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
                    <label className="form-label text-muted small fw-bold">SECTION TITLE</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., Introduction to Java"
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
                    <label className="form-label text-muted small fw-bold">ORDER PRIORITY</label>
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
                <div className="modal-footer border-top-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light text-muted"
                    onClick={() => {
                      setSectionModalOpen(false);
                      setEditingSection(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    {editingSection ? "Save Changes" : "Create Section"}
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
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {editingLesson ? "Edit Lesson" : "Add New Lesson"}
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
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label text-muted small fw-bold">LESSON TYPE</label>
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
                        <option value={LessonType.VIDEO}>Video Lesson</option>
                        <option value={LessonType.READING}>Reading Material</option>
                        <option value={LessonType.QUIZ}>Quiz / Assessment</option>
                        <option value={LessonType.CODING}>Coding Exercise</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small fw-bold">TITLE</label>
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
                    <div className="col-4">
                      <label className="form-label text-muted small fw-bold">ORDER</label>
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
                    <div className="col-8">
                      <label className="form-label text-muted small fw-bold">DURATION (SEC)</label>
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

                    {/* Conditional Fields */}
                    {lessonForm.lessonType === LessonType.VIDEO && (
                      <div className="col-12">
                        <label className="form-label text-muted small fw-bold">YOUTUBE URL</label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="https://youtube.com/watch?v=..."
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
                      <div className="col-12">
                        <label className="form-label text-muted small fw-bold">CONTENT</label>
                        <textarea
                          className="form-control"
                          rows={5}
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

                    <div className="col-12">
                      <div className="form-check form-switch bg-light p-3 rounded border">
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
                        <label className="form-check-label fw-medium mx-2" htmlFor="lessonPreviewSwitch">
                          Allow Free Preview
                        </label>
                        <div className="text-muted small ms-2">If enabled, users can view this lesson without purchasing.</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light text-muted"
                    onClick={() => {
                      setLessonModalOpen(false);
                      setEditingLesson(null);
                      setCurrentSectionForLesson(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    {editingLesson ? "Save Lesson" : "Add Lesson"}
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
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-danger text-white border-bottom-0">
                <h5 className="modal-title">Delete Section</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSectionToDelete(null)}
                />
              </div>
              <div className="modal-body p-4 text-center">
                <div className="mb-3">
                  <div className="bg-danger-subtle text-danger rounded-circle d-inline-flex p-3">
                    <i className="bi bi-exclamation-triangle-fill fs-3"></i>
                  </div>
                </div>
                <h5 className="fw-bold mb-2">Are you sure?</h5>
                <p className="text-muted mb-0">
                  You are about to delete <strong>"{sectionToDelete.title}"</strong>. All lessons inside this section will be permanently removed.
                </p>
              </div>
              <div className="modal-footer border-top-0 justify-content-center pb-4">
                <button
                  type="button"
                  className="btn btn-light px-4"
                  onClick={() => setSectionToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger px-4"
                  onClick={async () => {
                    if (sectionToDelete?.sectionId) {
                      await removeSection(sectionToDelete.sectionId);
                    }
                    setSectionToDelete(null);
                  }}
                >
                  Yes, Delete it
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
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-danger text-white border-bottom-0">
                <h5 className="modal-title">Delete Lesson</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setLessonToDelete(null)}
                />
              </div>
              <div className="modal-body p-4 text-center">
                <div className="mb-3">
                  <div className="bg-danger-subtle text-danger rounded-circle d-inline-flex p-3">
                    <i className="bi bi-trash-fill fs-3"></i>
                  </div>
                </div>
                <h5 className="fw-bold mb-2">Delete this lesson?</h5>
                <p className="text-muted">
                  <strong>"{lessonToDelete.title}"</strong> will be removed forever.
                </p>
              </div>
              <div className="modal-footer border-top-0 justify-content-center pb-4">
                <button
                  type="button"
                  className="btn btn-light px-4"
                  onClick={() => setLessonToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger px-4"
                  onClick={async () => {
                    if (lessonToDelete?.lessonId) {
                      await removeLesson(lessonToDelete.lessonId);
                    }
                    setLessonToDelete(null);
                  }}
                >
                  Delete Lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Builders */}
      {currentLessonForBuilder && showQuizBuilder && (
        <QuizBuilderModal
          onClose={() => {
            setShowQuizBuilder(false);
            setCurrentLessonForBuilder(null);
          }}
          lesson={currentLessonForBuilder}
          onSuccess={() => {
            // Refresh logic if needed, currently just closes
          }}
        />
      )}

      {currentLessonForBuilder && showCodingBuilder && (
        <CodingBuilderModal
          onClose={() => {
            setShowCodingBuilder(false);
            setCurrentLessonForBuilder(null);
          }}
          lesson={currentLessonForBuilder}
          onSuccess={() => {
            // Refresh logic if needed
          }}
        />
      )}
    </div>
  );
}
