import React from 'react';
import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';

import './__assets__/Pagination.scss';

const PAGINATION_PIECE_FIRST = 'first';
const PAGINATION_PIECE_PREVIOUS = 'previous';
const PAGINATION_PIECE_ELLIPSIS = 'ellipsis';
const PAGINATION_PIECE_PAGE_NUMBER = 'page-number';
const PAGINATION_PIECE_NEXT = 'next';
const PAGINATION_PIECE_LAST = 'last';

const DEFAULT_MAX_PAGE_NUMBER_LINKS = 5;

const computeVisiblePieces = (
  numberOfPages,
  activePage,
  maxPageNumbers = DEFAULT_MAX_PAGE_NUMBER_LINKS,
) => {
  const visiblePieces = [];
  let lowerLimit = activePage;
  let upperLimit = activePage;

  visiblePieces.push({
    type: PAGINATION_PIECE_FIRST,
    pageNumber: 1,
    isDisabled: activePage === 1,
  });

  visiblePieces.push({
    type: PAGINATION_PIECE_PREVIOUS,
    pageNumber: Math.max(1, activePage - 1),
    isDisabled: activePage === 1,
  });

  for (let i = 1; i < maxPageNumbers && i < numberOfPages;) {
    if (lowerLimit > 1) {
      lowerLimit -= 1;
      i += 1;
    }

    if (i < maxPageNumbers && upperLimit < numberOfPages) {
      upperLimit += 1;
      i += 1;
    }
  }

  if (lowerLimit > 1) {
    visiblePieces.push({
      type: PAGINATION_PIECE_PAGE_NUMBER,
      pageNumber: 1,
      isActive: activePage === 1,
    });
    visiblePieces.push({ type: PAGINATION_PIECE_ELLIPSIS });
  }

  for (let i = lowerLimit; i <= upperLimit; i += 1) {
    visiblePieces.push({
      type: PAGINATION_PIECE_PAGE_NUMBER,
      pageNumber: i,
      isActive: activePage === i,
    });
  }

  if (activePage < numberOfPages - 2 && numberOfPages > maxPageNumbers) {
    visiblePieces.push({ type: PAGINATION_PIECE_ELLIPSIS });
    visiblePieces.push({
      type: PAGINATION_PIECE_PAGE_NUMBER,
      pageNumber: numberOfPages,
      isActive: activePage === numberOfPages,
    });
  }

  visiblePieces.push({
    type: PAGINATION_PIECE_NEXT,
    pageNumber: Math.min(numberOfPages, activePage + 1),
    isDisabled: activePage === numberOfPages,
  });

  visiblePieces.push({
    type: PAGINATION_PIECE_LAST,
    pageNumber: numberOfPages,
    isDisabled: activePage === numberOfPages,
  });

  return visiblePieces;
};

const Pagination = ({
  totalPages, itemsPerPage, totalItems, activePage = 1, onPageClick = (pageNumber, event) => {
    event.currentTarget.blur();
    window.scrollTo(0, 0);
  }, getPageUrl,
}) => {
  const location = useLocation();
  const defaultGetPageUrlCallback = (page) => `${location.pathname}?page=${page}`;
  const getPageUrlCallback = getPageUrl || defaultGetPageUrlCallback;
  const visiblePieces = computeVisiblePieces(totalPages, activePage);
  const index = activePage - 1;
  const offset = (index * itemsPerPage) + 1;
  const limit = activePage * itemsPerPage;

  if (totalPages < 2) {
    return null;
  }

  return (
    <nav className="pagination" aria-label={`pagination: total ${totalPages} pages`}>
      <div className="pagination--summary">
        Showing {offset} - {limit <= totalItems ? limit : totalItems} of {totalItems} results
      </div>

      <ul className="pagination--list">
        {visiblePieces.map(
          ({
            type, pageNumber, isActive, isDisabled,
          }, i) => {
            const key = `${type}-${i}`;
            const onClick = (event) => onPageClick(pageNumber, event);

            if (isDisabled) {
              return null;
            }

            return (
              <li className="pagination--list-item" key={key}>
                {type === PAGINATION_PIECE_FIRST && (
                  <Link
                    className="pagination--link"
                    data-test="first"
                    onClick={onClick}
                    to={getPageUrlCallback(pageNumber)}
                  >
                    <span aria-hidden="true" role="presentation">«</span>
                    &nbsp;First
                  </Link>
                )}

                {type === PAGINATION_PIECE_PREVIOUS && (
                  <Link
                    className="pagination--link"
                    data-test="prev"
                    onClick={onClick}
                    to={getPageUrlCallback(pageNumber)}
                  >
                    Previous
                  </Link>
                )}

                {type === PAGINATION_PIECE_ELLIPSIS && (
                  <span className="pagination--ellipsis" data-test="ellipsis">
                    …
                  </span>
                )}

                {type === PAGINATION_PIECE_PAGE_NUMBER && (
                  <Link
                    className={classNames('pagination--link', { 'pagination--link-active': isActive })}
                    data-test={isActive ? 'page-number-active' : 'page-number'}
                    onClick={onClick}
                    to={getPageUrlCallback(pageNumber)}
                  >
                    {pageNumber}
                  </Link>
                )}

                {type === PAGINATION_PIECE_NEXT && (
                  <Link
                    className="pagination--link"
                    data-test="next"
                    onClick={onClick}
                    to={getPageUrlCallback(pageNumber)}
                  >
                    Next
                  </Link>
                )}

                {type === PAGINATION_PIECE_LAST && (
                  <Link
                    className="pagination--link"
                    data-test="last"
                    onClick={onClick}
                    to={getPageUrlCallback(pageNumber)}
                  >
                    Last&nbsp;
                    <span aria-hidden="true" role="presentation">»</span>
                  </Link>
                )}
              </li>
            );
          },
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
