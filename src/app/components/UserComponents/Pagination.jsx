const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center items-center mt-4">
    <button
      className="px-3 py-1 border rounded mx-1 cursor-pointer hover:bg-gray-300"
      onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
      disabled={currentPage === 1}
    >
      Anterior
    </button>
    <span className="px-3">
      Página {currentPage} de {totalPages}
    </span>
    <button
      className="px-3 py-1 border rounded mx-1 cursor-pointer hover:bg-gray-300"
      onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      Próxima
    </button>
  </div>
);

export default Pagination;
