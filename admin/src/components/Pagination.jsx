import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
          className={`px-2 py-1 rounded-md text-sm font-medium ${
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
          className={`px-2 py-1 rounded-md text-sm font-medium ${
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
            className="text-sm font-medium text-gray-500"
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
          className={`px-2 py-1 rounded-md text-sm font-medium ${
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
            className="text-sm font-medium text-gray-500"
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
          className={`px-2 py-1 rounded-md text-sm font-medium ${
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
    <div className="flex items-center justify-center gap-2 mt-6 overflow-x-auto">
      {/* Previous Button */}
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed sm:hidden"
        >
          <ArrowLeft size={16} />
        </button>
      )}

      {/* Pagination Container */}
      <div className="flex items-center gap-2">
        {/* Previous Button (Visible on Larger Screens) */}
        {currentPage > 1 && (
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            className="hidden sm:flex justify-between items-center px-3 py-1 bg-gray-900  text-white rounded-md text-sm font-medium hover:bg-gray-300 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} className="mr-1" />
          </button>
        )}

        {/* Page Numbers */}
        <div className="flex gap-2">{renderPages()}</div>

        {/* Next Button (Visible on Larger Screens) */}
        {currentPage < totalPages && (
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            className="hidden sm:flex justify-between items-center px-3 py-1 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-300 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight size={16} className="ml-1" />
          </button>
        )}
      </div>

      {/* Next Button */}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed sm:hidden"
        >
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
};

export default Pagination;
