import React, { useState, useEffect } from "react";
import FilterPanel from "./TableComponents/FilterPanel";
import TableRow from "./TableComponents/TableRow";
import Pagination from "./TableComponents/Pagination";
import DetailsModal from "./DetailsModal";
import CostDetailsModal from "./CostDetailsModal";
import handleStatusFlag from "../utils/handleStatusFlag";
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

  // Filtrar dados
  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.dataCriacao);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const matchesSearch =
      !searchQuery ||
      item.cnpj.includes(searchQuery) ||
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

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate, statusFilter, itemsPerPage]);

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

  console.log(filteredData)

  return (
    <div className="overflow-x-auto ">
      {openModal && selectedItem && (
        <DetailsModal item={selectedItem} onClose={() => setModal(false)} />
      )}
      {openCostModal && selectedItem && (
        <CostDetailsModal
          item={selectedItem}
          onClose={() => setCostModal(false)}
        />
      )}

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
      <div className="flex justify-between items-center mb-2 p-2 md:p-0">
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

      <table className="min-w-full border border-gray-300 ">
        <thead className="hidden md:table-header-group">
          <tr className="bg-gray-200 text-gray-700">
            <th className="border p-2">#</th>
            <th className="border p-2">CNPJ - Fornecedor</th>
            <th className="border p-2">Data de abertura</th>
            <th className="border p-2">Ultima atualização</th>
            <th className="border p-2">Aréa responsável</th>
            <th className="border p-2">Descrição</th>
            <th className="border p-2">Valor</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Ações</th>
          </tr>
        </thead>
        <tbody className="hidden md:table-row-group">
          {currentData.map((item, key) => (
            <ResponsiveRow
              key={key}
              item={item}
              onDetailsClick={handleDetailsClick}
              onCostClick={handleCostClick}
            />
          ))}
        </tbody>
      </table>

      {/* Mobile View */}
      <div className="md:hidden p-3">
        {currentData.map((item) => (
          <ResponsiveRow
            key={item._id}
            item={item}
            onDetailsClick={handleDetailsClick}
            onCostClick={handleCostClick}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalData={filteredData.length}
      />
    </div>
  );
};

export default ManagerReportDataTable;
