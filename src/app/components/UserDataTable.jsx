import React, { useState, useEffect } from "react";
import formatDate from "../utils/formatDate";

const DataTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [medicaoFilter, setMedicaoFilter] = useState("");
  const [notaFiscalFilter, setNotaFiscalFilter] = useState("");

  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.data);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const matchesSearch = !searchQuery ||
      item.protocolo.toString().includes(searchQuery) ||
      (item.aprovador?.toLowerCase().includes(searchQuery.toLowerCase())) ||
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

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 mb-4 flex-wrap">
        <div className="mb-4">
          <label className="block mb-1">Buscar por protocolo, aprovador ou área responsável</label>
          <input type="text" placeholder="Buscar" className="border rounded p-2 w-100" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
          <select className="border rounded p-2" value={notaFiscalFilter} onChange={(e) => setNotaFiscalFilter(e.target.value)}>
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
            <th className="border p-2">Etapa</th>
            <th className="border p-2">Data de abertura</th>
            <th className="border p-2">Ultima atualização</th>
            <th className="border p-2">Aprovador do Serviço</th>
            <th className="border p-2">Área responsável</th>
            <th className="border p-2">Aprovado Medição</th>
            <th className="border p-2">Aprovado Nota Fiscal</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item._id} className="border hover:bg-gray-100">
              <td className="border p-2 text-center">{item.protocolo}</td>
              <td className="border p-2 text-center">{item.etapa}</td>
              <td className="border p-2 text-center">{formatDate(item.data)}</td>
              <td className="border p-2 text-center">{formatDate(item.dataAtualizacao)}</td>
              <td className="border p-2 text-center">{item.aprovador ?? "-"}</td>
              <td className="border p-2 text-center">{item.areaResponsavel ?? "-"}</td>
              <td className="border p-2 text-center">
                <span className={`inline-block w-3 h-3 rounded-full ${item.aprovadoSolicitacao ? "bg-green-500" : "bg-red-500"}`}>
                </span>
              </td>
              <td className="border p-2 text-center">
                <span className={`inline-block w-3 h-3 rounded-full ${item.aprovadoNF ? "bg-green-500" : "bg-red-500"}`}>
                </span>
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
