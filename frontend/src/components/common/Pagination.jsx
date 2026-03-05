import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Pagination = ({ pagination, onPageChange }) => {
  const { page, pages, total } = pagination;

  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(pages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < pages - 1) {
      rangeWithDots.push('...', pages);
    } else if (pages > 1) {
      rangeWithDots.push(pages);
    }

    return [...new Set(rangeWithDots)];
  };

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <small style={{ color: 'var(--gray-500)' }}>
        Showing page {page} of {pages} ({total} total)
      </small>
      <nav>
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(page - 1)}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          </li>
          {getPageNumbers().map((p, i) =>
            p === '...' ? (
              <li key={`dots-${i}`} className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            ) : (
              <li key={p} className={`page-item ${page === p ? 'active' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(p)}>
                  {p}
                </button>
              </li>
            )
          )}
          <li className={`page-item ${page >= pages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(page + 1)}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
