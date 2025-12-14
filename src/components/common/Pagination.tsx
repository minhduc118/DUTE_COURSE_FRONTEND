import React from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(0, currentPage - 2);
  const end = Math.min(totalPages - 1, start + 4);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-end">
        <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(0)}>&laquo;</button>
        </li>
        <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(Math.max(0, currentPage - 1))}>Prev</button>
        </li>

        {pages.map(p => (
          <li key={p} className={`page-item ${p === currentPage ? "active" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(p)}>{p + 1}</button>
          </li>
        ))}

        <li className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}>Next</button>
        </li>
        <li className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(totalPages - 1)}>&raquo;</button>
        </li>
      </ul>
    </nav>
  );
};