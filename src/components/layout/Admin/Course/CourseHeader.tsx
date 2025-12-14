import React from 'react';

interface CourseHeaderProps {
  totalCourses: number;
  onAddCourse: () => void;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({ totalCourses, onAddCourse }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="mb-1">Course Management</h2>
        <p className="text-muted mb-0">
          Manage all courses in the system ({totalCourses} total)
        </p>
      </div>
      <button className="btn btn-primary" onClick={onAddCourse}>
        <i className="bi bi-plus-circle me-2"></i>
        Add New Course
      </button>
    </div>
  );
};






