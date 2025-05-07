import React, { useState, useEffect, useRef } from "react";
import formatDate from "../utils/formatDate";
import * as Tooltip from '@radix-ui/react-tooltip'
import UserDetailsModal from "./UserDetailsModal";
import formatCNPJ from "../utils/formatCNPJ";

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
  const uniqueCNPJs = [...new Set(data.map(item => item.cnpj))].filter(Boolean);

  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.data);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const matchesSearch = !searchQuery ||
      item.protocolo.toString().includes(searchQuery) ||
      (item.aprovador?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.fornecedor?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.cnpj?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.areaResponsavel?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDateRange = (!start || itemDate >= start) && (!end || itemDate <= end);
    const matchesMedicao = !medicaoFilter || (medicaoFilter === "approved" && item.aprovadoSolicitacao) || (medicaoFilter === "reproved" && !item.aprovadoSolicitacao);
    const matchesNotaFiscal = !notaFiscalFilter || (notaFiscalFilter === "approved" && item.aprovadoNF) || (notaFiscalFilter === "reproved" && !item.aprovadoNF);

    return matchesSearch && matchesDateRange && matchesMedicao && matchesNotaFiscal;
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
      <div className="flex gap-4 mb-4 flex-wrap">
        <div className="mb-4 relative">
          <label className="block mb-1">Buscar por protocolo, aprovador ou área responsável</label>
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
                .filter(cnpj => cnpj.toLowerCase().includes(searchQuery.toLowerCase()))
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
                    {cnpj} - {data.find(item => item.cnpj === cnpj)?.fornecedor}
                  </li>
                ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Data inicial</label>
          <input type="date" className="border rounded p-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Data final</label>
          <input type="date" className="border rounded p-2" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Medição de serviço</label>
          <select className="border rounded p-2" value={medicaoFilter} onChange={(e) => setMedicaoFilter(e.target.value)}>
            <option value="">Selecione uma opção</option>
            <option value="approved">Aprovada</option>
            <option value="reproved">Reprovada</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Nota fiscal</label>
          <select className="border rounded p-2 w-50" value={notaFiscalFilter} onChange={(e) => setNotaFiscalFilter(e.target.value)}>
            <option value="">Selecione uma opção</option>
            <option value="approved">Aprovada</option>
            <option value="reproved">Reprovada</option>
          </select>
        </div>
      </div>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="border p-2">Protocolo</th>
            <th className="border p-2">{classId === "67e2e09b40652a3ea4250bd5" ? "Etapa" : "Fornecedor"}</th>
            <th className="border p-2">Data de abertura</th>
            <th className="border p-2">Ultima atualização</th>
            <th className="border p-2">Aprovador do Serviço</th>
            <th className="border p-2">{classId === "67e2e09b40652a3ea4250bd5" ? "Área responsável" : "Descrição"}</th>
            <th className="border p-2">Aprovado Medição</th>
            <th className="border p-2">Aprovado Nota Fiscal</th>
            <th className="border p-2">Solicitação paga</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item._id} className="border hover:bg-gray-100 hover:cursor-pointer" onClick={() => handleModal(item)}>
              <td className="border p-2 text-center">{item.protocolo}</td>
              <td className="border p-2 text-center">
                {classId === "67e2e09b40652a3ea4250bd5" ? (
                  item.pagamentoConfirmado !== null
                    ? "Pago"
                    : item.aprovadoNF && item.aprovadoSolicitacao
                      ? "Aprovado"
                      : item.etapa
                ) : (
                  <>
                    {formatCNPJ(item.cnpj)} - <br />
                    {item.fornecedor}
                  </>
                )}
              </td>
              <td className="border p-2 text-center">{formatDate(item.data)}</td>
              <td className="border p-2 text-center">{formatDate(item.dataAtualizacao)}</td>
              <td className="border p-2 text-center">{item.aprovador ?? "-"}</td>
              <td className="border p-2 text-center">{classId === "67e2e09b40652a3ea4250bd5" ? item.areaResponsavel : (
                item.descricao.length > 30
                ? `${item.descricao.substring(0, 30)}...`
                : item.descricao
              )}
                </td>
              <td className="border p-2 text-center">
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <span className={`inline-block w-3 h-3 border p-2 hover:cursor-pointer rounded-full ${item.aprovadoSolicitacao ? "bg-green-500" : "bg-red-500"}`}>
                      </span>
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg"
                      side="top"
                      sideOffset={5}
                    >
                      {item.aprovadoSolicitacao ? "Medição aprovada" : "Medição pendente aprovação"}
                      <Tooltip.Arrow className="fill-gray-800" />
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </td>
              <td className="border p-2 text-center">
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <span className={`inline-block w-3 h-3 border p-2 hover:cursor-pointer rounded-full ${item.aprovadoNF ? "bg-green-500" : "bg-red-500"}`}>
                      </span>
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg"
                      side="top"
                      sideOffset={5}
                    >
                      {item.aprovadoNF ? "Nota fiscal aprovada" : "Nota fiscal pendente aprovação"}
                      <Tooltip.Arrow className="fill-gray-800" />
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </td>
              <td className="border p-2 text-center">
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <span className={`inline-block w-3 h-3 border p-2 hover:cursor-pointer rounded-full ${item.pagamentoConfirmado ? "bg-green-500" : "bg-red-500"}`}>
                      </span>
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg"
                      side="top"
                      sideOffset={5}
                    >
                      {item.pagamentoConfirmado ? "Solicitação paga" : "Solicitação não paga"}
                      <Tooltip.Arrow className="fill-gray-800" />
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center items-center mt-4">
        <button className="px-3 py-1 border rounded mx-1 cursor-pointer hover:bg-gray-300" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Anterior
        </button>
        <span className="px-3">Página {currentPage} de {totalPages}</span>
        <button className="px-3 py-1 border rounded mx-1 cursor-pointer hover:bg-gray-300" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Próxima
        </button>
      </div>
    </div>
  );
};

export default DataTable;
