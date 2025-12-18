import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CourseModel } from "../../../../model/CourseModel";
import { useCourses } from "../../../../hooks/useCourses";
import { CourseHeader } from "./CourseHeader";
import { CourseSearchBar } from "./CourseSearchBar";
import { CourseTable } from "./CourseTable";
import { Pagination } from "../../../common/Pagination";
import { CourseFormModal } from "./CourseFormModal";
import { DeleteCourseModal } from "./DeleteCourseModal";


export default function ListCourses() {
  const {
    courses,
    loading,
    page,
    totalPages,
    setPage,
    addCourse,
    editCourse,
    removeCourse,
    refresh,
  } = useCourses(0, 10);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseModel | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Filter courses based on search
  const filteredCourses = useMemo(() => {
    return courses.filter(
      (course) =>
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  const handleViewDetail = (course: CourseModel) => {
    if (!course.courseId) return;
    navigate(`/admin/products/${course.slug}`);
  };


  const handleAddCourse = () => {
    setIsEdit(false);
    setSelectedCourse(null);
    setShowFormModal(true);
  };

  const handleEditCourse = (course: CourseModel) => {
    setIsEdit(true);
    setSelectedCourse(course);
    setShowFormModal(true);
  };

  const handleDeleteCourse = (course: CourseModel) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (formData: any) => {
    if (isEdit && selectedCourse) {
      await editCourse(selectedCourse.courseId!, formData);
    } else {
      await addCourse(formData);
    }
    setShowFormModal(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedCourse) {
      await removeCourse(selectedCourse.courseId!);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Course Management</h1>
          <p className="page-subtitle">Manage your courses, edit content, and track performance.</p>
        </div>
        <button className="btn-primary-rose" onClick={handleAddCourse}>
          <i className="bi bi-plus-lg"></i>
          Add New Course
        </button>
      </div>

      <div className="admin-card mb-4">
        <div className="search-filter-bar mb-0">
          <div className="search-input-wrapper">
            <i className="bi bi-search search-icon-pos"></i>
            <input
              type="text"
              className="modern-search-input"
              placeholder="Search by course title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2 px-3 py-2 bg-light rounded border text-muted small fw-medium">
              <i className="bi bi-funnel"></i> Filter
            </div>
            <div style={{ width: 1, height: 16, background: '#cbd5e1' }}></div>
            <div className="small text-muted fw-medium">
              Total: <span className="text-dark fw-bold">{filteredCourses.length} courses</span>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        <div className="modern-table-container border-0 rounded-0">
          <table className="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Course Info</th>
                <th>Price</th>
                <th>Duration</th>
                <th className="text-center">Status</th>
                <th>Created At</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course, index) => {
                const processThumbnail = (thumbnail: string | undefined) => {
                  if (!thumbnail) return "https://placehold.co/80x56?text=No+Image";
                  return thumbnail.startsWith("data:")
                    ? thumbnail
                    : `data:image/png;base64,${thumbnail}`;
                };

                return (
                  <tr key={course.courseId || index} className="group">
                    <td className="text-muted fw-medium">#{course.courseId}</td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="table-thumb shadow-sm">
                          <img
                            src={processThumbnail(course.thumbnailBase64)}
                            alt={course.title}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://placehold.co/80x56?text=Error";
                            }}
                          />
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{course.title}</div>
                          <div className="small text-muted">/{course.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="fw-bold" style={{ color: 'var(--primary-rose)' }}>{course.price?.toLocaleString()} ₫</span>
                        {course.discountPrice && course.discountPrice < course.price! && (
                          <span className="small text-muted text-decoration-line-through">{course.discountPrice.toLocaleString()} ₫</span>
                        )}
                      </div>
                    </td>
                    <td className="text-muted small">
                      <i className="bi bi-clock me-1"></i> {course.durationInMonths ? `${course.durationInMonths} months` : 'N/A'}
                    </td>
                    <td className="text-center">
                      <span className="status-badge status-active">Active</span>
                    </td>
                    <td className="text-muted small">
                      <i className="bi bi-calendar3 me-1"></i> {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="text-end">
                      <div className="d-flex align-items-center justify-content-end gap-1">
                        <button className="action-btn view" title="View" onClick={() => handleViewDetail(course)}>
                          <i className="bi bi-eye fs-5"></i>
                        </button>
                        <button className="action-btn edit" title="Edit" onClick={() => handleEditCourse(course)}>
                          <i className="bi bi-pencil-square fs-5"></i>
                        </button>
                        <button className="action-btn delete" title="Delete" onClick={() => handleDeleteCourse(course)}>
                          <i className="bi bi-trash fs-5"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">No courses found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="d-flex align-items-center justify-content-between px-4 py-3 border-top border-light">
          <div className="small text-muted">
            Showing <span className="fw-bold text-dark">{filteredCourses.length > 0 ? 1 : 0}</span> to <span className="fw-bold text-dark">{filteredCourses.length}</span> of <span className="fw-bold text-dark">{filteredCourses.length}</span> results
          </div>
          <div className="modern-pagination">
            <button className="page-btn" disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>
              <i className="bi bi-chevron-left"></i>
            </button>
            <button className="page-btn active">{page + 1}</button>
            <button className="page-btn" disabled={page >= totalPages - 1} onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}>
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <CourseFormModal
        show={showFormModal}
        isEdit={isEdit}
        course={selectedCourse}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
      />

      <DeleteCourseModal
        show={showDeleteModal}
        course={selectedCourse}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}



