import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const MAX_VISIBLE_PAGES = 4; // Maximum number of visible pages (excluding ellipsis)
  const HALF_VISIBLE_PAGES = Math.floor(MAX_VISIBLE_PAGES / 2);

  const renderPages = () => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      // If total pages are small, show all pages without ellipsis
      return [...Array(totalPages).keys()].map((page) => (
        <button
          key={page + 1}
          onClick={() => onPageChange(page + 1)}
          className={`px-3 py-1 rounded-md text-lg font-medium ${
            currentPage === page + 1
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } cursor-pointer`}
        >
          {page + 1}
        </button>
      ));
    }

    // Calculate range of visible pages
    let startPage = Math.max(currentPage - HALF_VISIBLE_PAGES, 1);
    let endPage = Math.min(startPage + MAX_VISIBLE_PAGES - 1, totalPages);

    // Adjust startPage if endPage is near the end
    if (endPage === totalPages) {
      startPage = Math.max(endPage - MAX_VISIBLE_PAGES + 1, 1);
    }

    const pages = [];

    // Add the first page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={`px-3 py-1  rounded-md text-lg font-medium ${
            currentPage === 1
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } cursor-pointer`}
        >
          1
        </button>
      );

      // Add ellipsis after the first page
      if (startPage > 2) {
        pages.push(
          <span
            key="start-ellipsis"
            className="text-lg mt-1 font-medium text-gray-500"
          >
            ...
          </span>
        );
      }
    }

    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded-md text-lg font-medium ${
            currentPage === i
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } cursor-pointer`}
        >
          {i}
        </button>
      );
    }

    // Add ellipsis before the last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span
            key="end-ellipsis"
            className="text-lg font-medium text-gray-500"
          >
            ...
          </span>
        );
      }

      // Add the last page
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`px-3 py-1 rounded-md text-lg font-medium ${
            currentPage === totalPages
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } cursor-pointer`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-center gap-4 mt-6">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-200 text-lg font-medium hover:bg-gray-300 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {/* Page Numbers with Ellipsis */}
      <div className="flex gap-2">{renderPages()}</div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-200 text-lg font-medium hover:bg-gray-300 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
