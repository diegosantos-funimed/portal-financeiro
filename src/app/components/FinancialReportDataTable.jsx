import React, { useState, useEffect, useMemo } from "react";
import formatDate from "../utils/formatDate";
import formatNumberToDecimal from "../utils/formatNumberToDecimal";
import formatCNPJ from "../utils/formatCNPJ";
import {
  AttachMoney,
  Check,
  Close,
  Visibility,
  ThumbUp,
} from "@mui/icons-material";
import * as Tooltip from "@radix-ui/react-tooltip";
import breakText from "../utils/breakText";

// Modals
import DetailsModal from "./DetailsModal";
import CostDetailsModal from "./CostDetailsModal";
import ApprovalModal from "./ApprovalModal";

// Sub-components (sem alterações nesses, pois não afetam diretamente a tabela)
const TableFilters = ({
  searchQuery,
  setSearchQuery,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  statusFilter,
  setStatusFilter,
  isFilteredData,
}) => {
  if (isFilteredData) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <div>
        <label htmlFor="search-input" className="block mb-1 text-gray-700">
          Buscar por CNPJ, Solicitante, Protocolo, Área responsável ou TOTVS:
        </label>
        <input
          id="search-input"
          type="text"
          className="border border-gray-300 rounded p-2 w-full focus:ring-blue-500 focus:border-blue-500"
          placeholder="Digite para buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
      <div>
        <label htmlFor="status-filter" className="block mb-1 text-gray-700">
          Status do Pagamento:
        </label>
        <select
          id="status-filter"
          className="border border-gray-300 rounded w-48 p-2 focus:ring-blue-500 focus:border-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="pago">Pago</option>
          <option value="pendente">Pendente</option>
        </select>
      </div>
    </div>
  );
};

const TableRowActions = ({ item, handlePaymentModal, handleModal, handleCostModal }) => (
  <td className="py-3 px-1 text-center flex justify-center items-center gap-2 mt-3">
    {item.pagamentoConfirmado === null && (
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              className="h-8 w-8 flex items-center justify-center p-1 border border-black font-medium text-sm rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              onClick={() => handlePaymentModal(item)}
              aria-label="Confirmar pagamento"
            >
              <ThumbUp fontSize="small" />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content
            className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg max-w-xs"
            side="bottom"
            sideOffset={5}
          >
            Confirmar que o pagamento foi efetuado
            <Tooltip.Arrow className="fill-gray-800" />
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    )}

    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            className="h-8 w-8 flex items-center justify-center p-1 border border-black font-medium text-sm rounded-md text-white bg-blue-400 hover:bg-blue-500 transition-colors"
            onClick={() => handleModal(item)}
            aria-label="Visualizar detalhes"
          >
            <Visibility fontSize="small" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content
          className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg max-w-xs"
          side="bottom"
          sideOffset={5}
        >
          Visualizar detalhes da solicitação
          <Tooltip.Arrow className="fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>

    {item.centroDeCusto !== "-" && (
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              className="h-8 w-8 flex items-center justify-center p-1 border border-black font-medium text-sm rounded-md text-white bg-green-700 hover:bg-green-800 transition-colors"
              onClick={() => handleCostModal(item)}
              aria-label="Visualizar centro de custo"
            >
              <AttachMoney fontSize="small" />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content
            className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg max-w-xs"
            side="bottom"
            sideOffset={5}
          >
            Visualizar detalhes do centro de custo
            <Tooltip.Arrow className="fill-gray-800" />
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    )}
  </td>
);

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

// Main Component
const FinancialReportDataTable = ({ data, isFilteredData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [openModal, setModal] = useState(false);
  const [openCostModal, setCostModal] = useState(false);
  const [openPaymentModal, setPaymentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filtrando os dados usando useMemo para otimização
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const itemDate = new Date(item.dataCriacao);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const matchesSearch =
        !searchQuery ||
        formatCNPJ(item.cnpj).includes(searchQuery) ||
        item.solicitante.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formatDate(item.dataCriacao).includes(searchQuery) ||
        item.protocolo.toString().includes(searchQuery) ||
        item.lancamentoTOTVS.toString().includes(searchQuery) ||
        item.areaResponsavel?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDateRange =
        (!start || itemDate >= start) && (!end || itemDate <= end);

      const matchesPaymentStatus =
        !statusFilter ||
        (statusFilter === "pago" && item.pagamentoConfirmado !== null) ||
        (statusFilter === "pendente" && item.pagamentoConfirmado === null);

      return matchesSearch && matchesDateRange && matchesPaymentStatus;
    });
  }, [data, searchQuery, startDate, endDate, statusFilter]);

  // Atualiza o total de páginas com base nos dados filtrados
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  // Resetar a página para 1 sempre que os filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate, statusFilter]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleModal = (item) => {
    setSelectedItem(item);
    setModal(true);
  };

  const handleCostModal = (item) => {
    setSelectedItem(item);
    setCostModal(true);
  };

  const handlePaymentModal = (item) => {
    setSelectedItem(item);
    setPaymentModal(true);
  };


  return (
    <div className="overflow-x-auto p-4 bg-white shadow-md rounded-lg">
      {/* Modals */}
      {openModal && selectedItem && (
        <DetailsModal item={selectedItem} onClose={() => setModal(false)} />
      )}
      {openCostModal && selectedItem && (
        <CostDetailsModal
          item={selectedItem}
          onClose={() => setCostModal(false)}
        />
      )}
      {openPaymentModal && selectedItem && (
        <ApprovalModal
          item={selectedItem}
          onClose={() => setPaymentModal(false)}
        />
      )}

      {/* Filters */}
      <TableFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        isFilteredData={isFilteredData}
      />

      {/* Desktop Table */}
      <div className="hidden md:block"> {/* Hide on small screens */}
        <table className="min-w-full border border-gray-300 divide-y divide-gray-200 rounded-md overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                CNPJ - Fornecedor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Data de abertura
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Última atualização
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Área responsável
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Valor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Lançamento TOTVS
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Pago
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr
                  key={item.protocolo || index}
                  className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {breakText(item.protocolo.toString())}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {breakText(formatCNPJ(item.cnpj))} - <br /> {breakText(item.fornecedor)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {breakText(formatDate(item.dataCriacao))}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {breakText(formatDate(item.dataAtualizacao))}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {breakText(item.areaResponsavel)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    R$ {breakText(formatNumberToDecimal(item.valor))}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {breakText(item.lancamentoTOTVS.toString())}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                    {item.pagamentoConfirmado === null ? (
                      <Close className="text-red-500" />
                    ) : (
                      <Check className="text-green-500" />
                    )}
                  </td>
                  <TableRowActions
                    item={item}
                    handlePaymentModal={handlePaymentModal}
                    handleModal={handleModal}
                    handleCostModal={handleCostModal}
                  />
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
          currentData.map((item, index) => (
            <div
              key={item.protocolo || index}
              className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200"
            >
              <div className="mb-2">
                <span className="font-bold text-gray-800">Protocolo: </span>
                <span className="text-gray-700">{breakText(item.protocolo.toString())}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold text-gray-800">CNPJ - Fornecedor: </span>
                <span className="text-gray-700">{breakText(formatCNPJ(item.cnpj))} - {breakText(item.fornecedor)}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold text-gray-800">Abertura: </span>
                <span className="text-gray-700">{breakText(formatDate(item.dataCriacao))}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold text-gray-800">Atualização: </span>
                <span className="text-gray-700">{breakText(formatDate(item.dataAtualizacao))}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold text-gray-800">Área Responsável: </span>
                <span className="text-gray-700">{breakText(item.areaResponsavel)}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold text-gray-800">Valor: </span>
                <span className="text-gray-700">R$ {breakText(formatNumberToDecimal(item.valor))}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold text-gray-800">Lançamento TOTVS: </span>
                <span className="text-gray-700">{breakText(item.lancamentoTOTVS.toString())}</span>
              </div>
              <div className="flex items-center mb-4">
                <span className="font-bold text-gray-800 mr-2">Pago: </span>
                {item.pagamentoConfirmado === null ? (
                  <Close className="text-red-500" />
                ) : (
                  <Check className="text-green-500" />
                )}
              </div>
              <div className="flex justify-start items-center gap-2 mt-3">
                {item.pagamentoConfirmado === null && (
                  <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button
                          type="button"
                          className="h-8 w-8 flex items-center justify-center p-1 border border-black font-medium text-sm rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                          onClick={() => handlePaymentModal(item)}
                          aria-label="Confirmar pagamento"
                        >
                          <ThumbUp fontSize="small" />
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg max-w-xs"
                        side="bottom"
                        sideOffset={5}
                      >
                        Confirmar que o pagamento foi efetuado
                        <Tooltip.Arrow className="fill-gray-800" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                )}

                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        type="button"
                        className="h-8 w-8 flex items-center justify-center p-1 border border-black font-medium text-sm rounded-md text-white bg-blue-400 hover:bg-blue-500 transition-colors"
                        onClick={() => handleModal(item)}
                        aria-label="Visualizar detalhes"
                      >
                        <Visibility fontSize="small" />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg max-w-xs"
                      side="bottom"
                      sideOffset={5}
                    >
                      Visualizar detalhes da solicitação
                      <Tooltip.Arrow className="fill-gray-800" />
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>

                {item.centroDeCusto !== "-" && (
                  <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button
                          type="button"
                          className="h-8 w-8 flex items-center justify-center p-1 border border-black font-medium text-sm rounded-md text-white bg-green-700 hover:bg-green-800 transition-colors"
                          onClick={() => handleCostModal(item)}
                          aria-label="Visualizar centro de custo"
                        >
                          <AttachMoney fontSize="small" />
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg max-w-xs"
                        side="bottom"
                        sideOffset={5}
                      >
                        Visualizar detalhes do centro de custo
                        <Tooltip.Arrow className="fill-gray-800" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                )}
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

export default FinancialReportDataTable;