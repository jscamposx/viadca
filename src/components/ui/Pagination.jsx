import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      for (let i = start; i <= end; i++) visiblePages.push(i);
    }
    return visiblePages;
  };

  const visiblePages = getVisiblePages();
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(
    currentPage * itemsPerPage,
    totalItems || currentPage * itemsPerPage,
  );

  return (
    <nav
      className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mt-8 w-full"
      role="navigation"
      aria-label="Paginación"
    >
      {/* Info */}
      <div className="text-xs sm:text-sm text-gray-600 px-1">
        Mostrando {start}-{end} de {totalItems || end}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
        {/* Controles */}
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <button
            type="button"
            aria-label="Página anterior"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-2.5 sm:px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
          >
            <FiChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Anterior</span>
          </button>

          {/* Páginas */}
          <div className="flex gap-1 max-w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 px-1" aria-label="Lista de páginas">
            {/* Primera */}
            {visiblePages[0] > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => onPageChange(1)}
                  className="min-w-[34px] px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs sm:text-sm"
                >
                  1
                </button>
                {visiblePages[0] > 2 && (
                  <span className="px-1.5 py-1.5 text-gray-500 text-xs sm:text-sm select-none">…</span>
                )}
              </>
            )}

            {/* Dinámicas */}
            {visiblePages.map((pageNum) => (
              <button
                type="button"
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[34px] px-2.5 py-1.5 rounded-lg text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  currentPage === pageNum
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                aria-current={currentPage === pageNum ? "page" : undefined}
              >
                {pageNum}
              </button>
            ))}

            {/* Última */}
            {visiblePages[visiblePages.length - 1] < totalPages && (
              <>
                {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                  <span className="px-1.5 py-1.5 text-gray-500 text-xs sm:text-sm select-none">…</span>
                )}
                <button
                  type="button"
                  onClick={() => onPageChange(totalPages)}
                  className="min-w-[34px] px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs sm:text-sm"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label="Página siguiente"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-2.5 sm:px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
          >
            <span className="hidden sm:inline mr-1">Siguiente</span>
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Pagination;
