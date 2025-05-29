import React, { useState, useEffect, useMemo } from "react";
import FilterPanel from "./TableComponents/FilterPanel";
import TableRow from "./TableComponents/TableRow";
import Pagination from "./TableComponents/Pagination";
import DetailsModal from "./DetailsModal";
import CostDetailsModal from "./CostDetailsModal";
import breakText from "../utils/breakText";
import handleStatusFlag from "../utils/handleStatusFlag";
import formatCNPJ from "../utils/formatCNPJ";
import formatDate from "../utils/formatDate";
import formatNumberToDecimal from "../utils/formatNumberToDecimal";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Visibility, AttachMoney } from "@mui/icons-material";
import StatusDot from "./TableComponents/StatusDot";
import ResponsiveRow from "./TableComponents/ResponsiveRow";

const ManagerReportDataTable = ({ data, isFilteredData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [openModal, setModal] = useState(false);
  const [openCostModal, setCostModal] = useState(false);
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
        item.protocolo.toString().includes(searchQuery) ||
        item.fornecedor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.areaResponsavel?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDateRange =
        (!start || itemDate >= start) && (!end || itemDate <= end);

      const matchesStatus =
        !statusFilter || handleStatusFlag(item) === statusFilter;

      return matchesSearch && matchesDateRange && matchesStatus;
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

  const handleDetailsClick = (item) => {
    setSelectedItem(item);
    setModal(true);
  };

  const handleCostClick = (item) => {
    setSelectedItem(item);
    setCostModal(true);
  };

  const getStatusText = (item) => {
    const status = handleStatusFlag(item);
    switch (status) {
      case "not_send":
        return "NF Pendente ou Medição reprovada";
      case "sended":
        return "NF enviada";
      case "totvs_id":
        return "Lançamento TOTVs realizado";
      case "finished":
        return "Aprovado e lançado no TOTVS";
      default:
        return "Desconhecido";
    }
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

      {/* Filters */}
      <FilterPanel
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
      <div className="flex justify-between items-center mb-2 p-2">
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
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
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
                Descrição
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Valor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Status
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
                    {breakText(formatCNPJ(item.cnpj))} - <br />
                    {breakText(item.fornecedor.length > 30 ? `${item.fornecedor.substring(0, 30)}...` : item.fornecedor)}

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
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {breakText(item.descricao.length > 50 ? `${item.descricao.substring(0, 50)}...` : item.descricao)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    R$ {breakText(formatNumberToDecimal(item.valor))}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                    <StatusDot item={item} />
                  </td>
                  <TableRowActions
                    item={item}
                    handleDetailsClick={handleDetailsClick}
                    handleCostClick={handleCostClick}
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
      <div className="md:hidden">
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
                <span className="font-bold text-gray-800">Descrição: </span>
                <span className="text-gray-700">{breakText(item.descricao.length > 50 ? `${item.descricao.substring(0, 50)}...` : item.descricao)}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold text-gray-800">Valor: </span>
                <span className="text-gray-700">R$ {breakText(formatNumberToDecimal(item.valor))}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold text-gray-800">Status: </span>
                <span className="text-gray-700">{getStatusText(item)}</span>
              </div>
              <div className="flex justify-start items-center gap-2 mt-3">
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        type="button"
                        className="h-8 w-8 flex items-center justify-center p-1 border border-black font-medium text-sm rounded-md text-white bg-blue-400 hover:bg-blue-500 transition-colors"
                        onClick={() => handleDetailsClick(item)}
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
                          onClick={() => handleCostClick(item)}
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default ManagerReportDataTable;

const TableRowActions = ({ item, handleDetailsClick, handleCostClick }) => (
  <td className="py-3 px-1 text-center flex justify-center items-center gap-2 mt-3">
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            className="h-8 w-8 flex items-center justify-center p-1 border border-black font-medium text-sm rounded-md text-white bg-blue-400 hover:bg-blue-500 transition-colors"
            onClick={() => handleDetailsClick(item)}
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
              onClick={() => handleCostClick(item)}
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