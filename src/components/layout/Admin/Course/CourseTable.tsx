import React from "react";
import { CourseModel } from "../../../../model/CourseModel";
import { CourseTableRow } from "./CourseTableRow";

interface CourseTableProps {
  courses: CourseModel[];
  loading: boolean;
  onViewDetail: (course: CourseModel) => void;
  onEdit: (course: CourseModel) => void;
  onDelete: (course: CourseModel) => void;
}

export const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  loading,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Created At</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                    No courses found
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <CourseTableRow
                    key={course.courseId}
                    course={course}
                    onViewDetail={onViewDetail}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};




