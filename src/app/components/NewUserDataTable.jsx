import React, { useState, useEffect, useRef, useMemo } from "react"; // Added useMemo
import DetailsModal from "./DetailsModal";
// Removed DataRowResponsive, Pagination imports as their logic will be integrated or re-styled
import formatDate from "../utils/formatDate"; // Re-import if needed for internal rendering
import formatCNPJ from "../utils/formatCNPJ"; // Re-import if needed for internal rendering
import formatNumberToDecimal from "../utils/formatNumberToDecimal"; // Re-import if needed for internal rendering
import StatusDotTooltip from "./UserComponents/StatusDotTooltip"; // Keep this as a sub-component
import * as Tooltip from "@radix-ui/react-tooltip"; // Added for consistency

// Componente de Filtro (Replicando TableFilters de FinancialReportDataTable)
const TableFilters = ({
  searchQuery, setSearchQuery,
  startDate, setStartDate,
  endDate, setEndDate,
  medicaoFilter, setMedicaoFilter,
  notaFiscalFilter, setNotaFiscalFilter,
  uniqueCNPJs, data, classId,
  inputRef, setShowSuggestions, showSuggestions,
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-4"> {/* Consistent styling for the filter container */}
      <div className="relative"> {/* Added relative for suggestions positioning */}
        <label htmlFor="search-input" className="block mb-1 text-gray-700">
          Buscar por Protocolo, Aprovador, Fornecedor, CNPJ ou Área responsável:
        </label>
        <input
          id="search-input"
          type="text"
          className="border border-gray-300 rounded p-2 w-full focus:ring-blue-500 focus:border-blue-500"
          placeholder="Digite para buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // delay p/ permitir clique
          ref={inputRef}
        />
        {showSuggestions && classId !== "67e2e09b40652a3ea4250bd5" && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto mt-1"> {/* Consistent styling for suggestions */}
              {uniqueCNPJs
                .filter((cnpj) =>
                  cnpj.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((cnpj, idx) => (
                  <li
                    key={idx}
                    className="px-3 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer" // Consistent list item styling
                    onMouseDown={() => {
                      setSearchQuery(cnpj);
                      setShowSuggestions(false);
                      inputRef.current?.blur();
                    }}
                  >
                    {formatCNPJ(cnpj)} -{" "}
                    {data.find((item) => item.cnpj === cnpj)?.fornecedor}
                  </li>
                ))}
            </ul>
          )}
      </div>

      <div className="flex gap-4">
        <div>
          <label htmlFor="start-date" className="block mb-1 text-gray-700">
            Data Inicial:
          </label>
          <input
            id="start-date"
            type="date"
            className="border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block mb-1 text-gray-700">
            Data Final:
          </label>
          <input
            id="end-date"
            type="date"
            className="border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-4"> {/* Grouped for better layout like FinancialReportDataTable */}
        <div>
          <label htmlFor="medicao-filter" className="block mb-1 text-gray-700">
            Medição de serviço:
          </label>
          <select
            id="medicao-filter"
            className="border border-gray-300 rounded w-48 p-2 focus:ring-blue-500 focus:border-blue-500" // w-48 for consistent width
            value={medicaoFilter}
            onChange={(e) => setMedicaoFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="approved">Aprovada</option>
            <option value="reproved">Reprovada</option>
          </select>
        </div>
        <div>
          <label htmlFor="nota-fiscal-filter" className="block mb-1 text-gray-700">
            Nota Fiscal:
          </label>
          <select
            id="nota-fiscal-filter"
            className="border border-gray-300 rounded w-48 p-2 focus:ring-blue-500 focus:border-blue-500" // w-48 for consistent width
            value={notaFiscalFilter}
            onChange={(e) => setNotaFiscalFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="approved">Aprovada</option>
            <option value="reproved">Reprovada</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Componente de Paginação (Replicando TablePagination de FinancialReportDataTable)
const TablePagination = ({ currentPage, totalPages, setCurrentPage }) => (
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


const DataTable = ({ data, classId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [medicaoFilter, setMedicaoFilter] = useState("");
  const [notaFiscalFilter, setNotaFiscalFilter] = useState("");
  const [openModal, setModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const inputRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Use useMemo for uniqueCNPJs as well, if `data` doesn't change frequently.
  const uniqueCNPJs = useMemo(() => {
    return [...new Set(data.map((item) => item.cnpj))].filter(Boolean);
  }, [data]);

  // Filtering data using useMemo for optimization
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const itemDate = new Date(item.data);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const matchesSearch =
        !searchQuery ||
        item.protocolo.toString().includes(searchQuery) ||
        item.aprovador?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fornecedor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cnpj?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.areaResponsavel?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDateRange =
        (!start || itemDate >= start) && (!end || itemDate <= end);
      const matchesMedicao =
        !medicaoFilter ||
        (medicaoFilter === "approved" && item.aprovadoSolicitacao) ||
        (medicaoFilter === "reproved" && !item.aprovadoSolicitacao);
      const matchesNotaFiscal =
        !notaFiscalFilter ||
        (notaFiscalFilter === "approved" && item.aprovadoNF) ||
        (notaFiscalFilter === "reproved" && !item.aprovadoNF);

      return (
        matchesSearch && matchesDateRange && matchesMedicao && matchesNotaFiscal
      );
    });
  }, [data, searchQuery, startDate, endDate, medicaoFilter, notaFiscalFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate, medicaoFilter, notaFiscalFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleModal = (item) => {
    setSelectedItem(item);
    setModal(true);
  };

  const getEtapaText = (item) => {
    if (classId === "67e2e09b40652a3ea4250bd5") {
      if (item.pagamentoConfirmado !== null) {
        return "Pago";
      } else if (item.aprovadoNF && item.aprovadoSolicitacao) {
        return "Aprovado";
      } else if (item.etapa === "Aguardando lançamento TOTVs") {
        return "Aguardando processo interno";
      } else {
        return item.etapa;
      }
    } else {
      return `${formatCNPJ(item.cnpj)} - ${item.fornecedor}`;
    }
  };

  return (
    <div className="overflow-x-auto p-4 bg-white shadow-md rounded-lg"> {/* Consistent main div styling */}
      {openModal && selectedItem && (
        <DetailsModal item={selectedItem} onClose={() => setModal(false)} />
      )}

      {/* Filters */}
      <TableFilters
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        startDate={startDate} setStartDate={setStartDate}
        endDate={endDate} setEndDate={setEndDate}
        medicaoFilter={medicaoFilter} setMedicaoFilter={setMedicaoFilter}
        notaFiscalFilter={notaFiscalFilter} setNotaFiscalFilter={setNotaFiscalFilter}
        uniqueCNPJs={uniqueCNPJs} data={data} classId={classId}
        inputRef={inputRef} setShowSuggestions={setShowSuggestions} showSuggestions={showSuggestions}
      />

      <div className="flex justify-between items-center mb-2 p-2"> {/* Removed md:p-0 */}
        <div id="total">
          <span>Total de registros: <span className="font-bold text-lg">{filteredData.length}</span> </span>
        </div>
        <div id="select" className="flex items-center gap-2">
          <span>Registros por pagina:</span>
          <select
            name="page_size"
            value={itemsPerPage}
            className="border p-2 rounded"
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
        {/* Removed "Registros por pagina" select to align with FinancialReportDataTable */}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block"> {/* Hide on small screens */}
        <table className="min-w-full border border-gray-300 divide-y divide-gray-200 rounded-md overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Protocolo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                {classId === "67e2e09b40652a3ea4250bd5" ? "Etapa" : "Fornecedor"}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Data de abertura
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Última atualização
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Valor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Descrição
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Aprov. Medição
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Aprov. Nota Fiscal
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Solicitação paga
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer"
                  onClick={() => handleModal(item)}
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.protocolo}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {getEtapaText(item)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(item.data)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(item.dataAtualizacao)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    R$ {formatNumberToDecimal(item.valor)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {item.descricao.length > 50
                      ? `${item.descricao.substring(0, 50)}...`
                      : item.descricao}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                    <StatusDotTooltip
                      status={item.aprovadoSolicitacao}
                      label={
                        item.aprovadoSolicitacao
                          ? "Medição aprovada"
                          : "Medição pendente aprovação"
                      }
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                    <StatusDotTooltip
                      status={item.aprovadoNF}
                      label={
                        item.aprovadoNF
                          ? "Nota fiscal aprovada"
                          : "Nota fiscal pendente aprovação"
                      }
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                    <StatusDotTooltip
                      status={item.pagamentoConfirmado}
                      label={
                        item.pagamentoConfirmado
                          ? "Solicitação paga"
                          : "Solicitação não paga"
                      }
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="px-4 py-6 text-center text-gray-500 text-lg"
                >
                  Nenhum dado encontrado para os filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden"> {/* Show only on small screens */}
        {currentData.length > 0 ? (
          currentData.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200 cursor-pointer"
              onClick={() => handleModal(item)}
            >
              <div className="mb-2">
                <span className="font-bold text-gray-800">Protocolo: </span>
                <span className="text-gray-700">{item.protocolo}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold text-gray-800">Fornecedor: </span>
                <span className="text-gray-700">{formatCNPJ(item.cnpj)} - {item.fornecedor}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold text-gray-800">Área Responsável: </span>
                <span className="text-gray-700">{item.areaResponsavel}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold text-gray-800">Valor: </span>
                <span className="text-gray-700">R$ {formatNumberToDecimal(item.valor)}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold text-gray-800">Abertura: </span>
                <span className="text-gray-700">{formatDate(item.data)}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold text-gray-800">Atualização: </span>
                <span className="text-gray-700">{formatDate(item.dataAtualizacao)}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold text-gray-800">Descrição: </span>
                <span className="text-gray-700">
                  {item.descricao.length > 50
                    ? `${item.descricao.substring(0, 50)}...`
                    : item.descricao}
                </span>
              </div>
              
              <div className="flex flex-col gap-2 mt-3"> {/* Consistent spacing for status dots */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">Aprov. Medição: </span>
                  <StatusDotTooltip
                    status={item.aprovadoSolicitacao}
                    label={
                      item.aprovadoSolicitacao
                        ? "Medição aprovada"
                        : "Medição pendente"
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">Aprov. Nota Fiscal: </span>
                  <StatusDotTooltip
                    status={item.aprovadoNF}
                    label={
                      item.aprovadoNF
                        ? "Nota fiscal aprovada"
                        : "Nota fiscal pendente"
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">Solicitação paga: </span>
                  <StatusDotTooltip
                    status={item.pagamentoConfirmado}
                    label={
                      item.pagamentoConfirmado
                        ? "Solicitação paga"
                        : "Solicitação não paga"
                    }
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-6 text-center text-gray-500 text-lg">
            Nenhum dado encontrado para os filtros aplicados.
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default DataTable;