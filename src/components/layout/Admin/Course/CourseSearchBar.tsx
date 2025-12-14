import React from "react";

interface CourseSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalResults: number;
}

export const CourseSearchBar: React.FC<CourseSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  totalResults,
}) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by title, slug, description..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-8 text-end">
            <span className="text-muted">
              Total: <strong>{totalResults}</strong> courses
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};






