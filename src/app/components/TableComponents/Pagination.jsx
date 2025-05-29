// Pagination.jsx
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange, totalData }) => (
  <div className="flex justify-center items-center mt-4">
    <button
      className="px-4 py-2 border border-gray-300 rounded-l-md bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      Anterior
    </button>
    <span className="px-4 py-2 border-y border-gray-300 bg-white text-gray-800">
      Página {currentPage} de {totalPages}
    </span>
    <button
      className="px-4 py-2 border border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      Próxima
    </button>
  </div>
);

export default Pagination;
