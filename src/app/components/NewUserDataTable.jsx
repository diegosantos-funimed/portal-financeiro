import React, { useState, useEffect, useRef } from "react";
import formatDate from "../utils/formatDate";
import * as Tooltip from "@radix-ui/react-tooltip";
import UserDetailsModal from "./UserDetailsModal";
import formatCNPJ from "../utils/formatCNPJ";
import formatNumberToDecimal from "../utils/formatNumberToDecimal";
import DataRowResponsive from "./UserComponents/DataRowResponsive";
import Pagination from "./UserComponents/Pagination";
import StatusDotTooltip from "./UserComponents/StatusDotTooltip";

const DataTable = ({ data, classId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [medicaoFilter, setMedicaoFilter] = useState("");
  const [notaFiscalFilter, setNotaFiscalFilter] = useState("");
  const [openModal, setModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const inputRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const uniqueCNPJs = [...new Set(data.map((item) => item.cnpj))].filter(
    Boolean
  );

  const filteredData = data.filter((item) => {
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

  return (
    <div className="overflow-x-auto">
      {openModal && selectedItem && (
        <UserDetailsModal item={selectedItem} onClose={() => setModal(false)} />
      )}

      {/* Filtros */}
      {/* Você pode manter seu bloco atual de filtros ou usar um FilterPanel */}
      <div className="flex flex-col md:flex-row content-start gap-3 p-3 md:p-0">
        <div className="mb-4 relative">
          <label className="block mb-1">
            Buscar por protocolo, aprovador ou área responsável
          </label>
          <input
            type="text"
            placeholder="Buscar"
            className="border rounded p-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // delay p/ permitir clique
            ref={inputRef}
          />
          {showSuggestions && classId !== "67e2e09b40652a3ea4250bd5" && (
            <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-48 overflow-y-auto">
              {uniqueCNPJs
                .filter((cnpj) =>
                  cnpj.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((cnpj, idx) => (
                  <li
                    key={idx}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => {
                      setSearchQuery(cnpj);
                      setShowSuggestions(false);
                      inputRef.current?.blur();
                    }}
                  >
                    {cnpj} -{" "}
                    {data.find((item) => item.cnpj === cnpj)?.fornecedor}
                  </li>
                ))}
            </ul>
          )}
        </div>
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block mb-1">Data inicial</label>
            <input
              type="date"
              className="border rounded p-2 w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-1">Data final</label>
            <input
              type="date"
              className="border rounded p-2 w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block mb-1">Medição de serviço</label>
            <select
              className="border rounded p-2 md:w-50 w-full"
              value={medicaoFilter}
              onChange={(e) => setMedicaoFilter(e.target.value)}
            >
              <option value="">Selecione uma opção</option>
              <option value="approved">Aprovada</option>
              <option value="reproved">Reprovada</option>
            </select>
          </div>
          <div className="w-1/2">
            <label className="block mb-1">Nota fiscal</label>
            <select
              className="border rounded p-2 w-full md:w-50"
              value={notaFiscalFilter}
              onChange={(e) => setNotaFiscalFilter(e.target.value)}
            >
              <option value="">Selecione uma opção</option>
              <option value="approved">Aprovada</option>
              <option value="reproved">Reprovada</option>
            </select>
          </div>
        </div>
      </div>
      {/* Cabeçalho da tabela Desktop */}
      <table className="min-w-full border border-gray-300 hidden md:table">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="border p-2">Protocolo</th>
            <th className="border p-2">
              {classId === "67e2e09b40652a3ea4250bd5" ? "Etapa" : "Fornecedor"}
            </th>
            <th className="border p-2">Data de abertura</th>
            <th className="border p-2">Ultima atualização</th>
            <th className="border p-2">Valor</th>
            <th className="border p-2">Descrição</th>
            <th className="border p-2">Aprov. Medição</th>
            <th className="border p-2">Aprov. Nota Fiscal</th>
            <th className="border p-2">Solicitação paga</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <DataRowResponsive
              key={item._id}
              item={item}
              classId={classId}
              onClick={handleModal}
            />
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {currentData.map((item) => (
          <DataRowResponsive
            key={item._id}
            item={item}
            classId={classId}
            onClick={handleModal}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default DataTable;
