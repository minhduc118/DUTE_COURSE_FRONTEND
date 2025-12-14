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
    <div className="container-fluid">
      <CourseHeader totalCourses={courses.length} onAddCourse={handleAddCourse} />

      <CourseSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalResults={filteredCourses.length}
      />

      <CourseTable
        courses={filteredCourses}
        loading={loading}
        onViewDetail={handleViewDetail}
        onEdit={handleEditCourse}
        onDelete={handleDeleteCourse}
      />
      <div className="d-flex justify-content-end align-items-center mt-3">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
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



