import React, { useState, useEffect } from "react";
import formatDate from "../utils/formatDate";
import formatNumberToDecimal from "../utils/formatNumberToDecimal";
import formatCNPJ from "../utils/formatCNPJ";
import LegendTooltip from "./LegendTooptip";
import { AttachMoney, Money, Visibility } from "@mui/icons-material";
import handleStatusFlag from "../utils/handleStatusFlag";
import DetailsModal from "./DetailsModal";
import CostDetailsModal from "./CostDetailsModal";

const ManagerReportDataTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [openModal, setModal] = useState(false);
  const [openCostModal, setCostModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedTooltip, setSelectedTooltip] = useState(null);

  // Filtrando os dados
  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.dataCriacao);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const matchesSearch =
      formatCNPJ(item.cnpj).includes(searchQuery) ||
      item.solicitante.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatDate(item.dataCriacao).includes(searchQuery) ||
      item.protocolo.toString().includes(searchQuery); // <-- Adicionado filtro pelo protocolo

    const matchesDateRange = (!start || itemDate >= start) && (!end || itemDate <= end);

    const matchesStatus = !statusFilter || handleStatusFlag(item) === statusFilter;

    return matchesSearch && matchesDateRange && matchesStatus;
  });


  // Atualiza o total de páginas com base nos dados filtrados
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  // Resetar a página para 1 sempre que os filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate, statusFilter]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Redirecionar para o link de download
  const handleRedirect = (protocolNumber, nf) => {
    const url = `https://faculdadeunimed-dev.sydle.one/api/1/main/br.edu.faculdadeUnimed.integracao/FachadaDeIntegracaoPortalDeNotas/downloadServiceFiles/?protocolo=${protocolNumber}&anexo=${nf}`;
    window.open(url, "_blank");
  };

  const handleModal = (item) => {
    setSelectedItem(item);
    setModal(true);
  };

  const handleCostModal = (item) => {
    setSelectedItem(item);
    setCostModal(true);
  }

  return (
    <div className="overflow-x-auto ">
      {/* Modal geral */}
      {openModal && selectedItem && (
        <DetailsModal item={selectedItem} onClose={() => setModal(false)} />
      )}
      {/* Modal de centro de custo */}
      {openCostModal && selectedItem && (
        <CostDetailsModal item={selectedItem} onClose={() => setCostModal(false)} />
      )}
      {/* Ficou parado */}
      {showTooltip && (
        <div className="absolute right-0 mt-6 w-80 p-2 bg-gray-800 text-white text-sm rounded transition-opacity">
          {selectedTooltip.status}
        </div>
      )}
      <div className="flex content-start gap-3">
        <div className="mb-4">
          <label className="block mb-1">Buscar por CNPJ, Solicitante ou Protocolo:</label>
          <input
            type="text"
            className="border rounded p-2 w-100"
            placeholder="Digite para buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block mb-1">Data Inicial:</label>
            <input
              type="date"
              className="border rounded p-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1">Data Final:</label>
            <input
              type="date"
              className="border rounded p-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex mb-4 flex-col">
          <label className="block mb-1">Status:</label>
          <select
            name="status_filter"
            id="status_filter"
            className="border rounded p-2 w-50"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Selecione uma opção</option>
            <option value="not_send">Não enviada</option>
            <option value="reproved">Reprovada</option>
            <option value="approved">Aprovada</option>
            <option value="paid">Pago</option>
          </select>
        </div>
        <div className="w-full mb-4 self-center">
          <LegendTooltip />
        </div>
      </div>

      <table className="min-w-full border border-gray-300 ">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="border p-2">#</th>
            <th className="border p-2">CNPJ - Fornecedor</th>
            <th className="border p-2">Data de abertura</th>
            <th className="border p-2">Ultima atualização</th>
            <th className="border p-2">Aréa responsável</th>
            <th className="border p-2">Descrição</th>
            <th className="border p-2">Valor</th>
            <th className="border p-2">Status</th>
            {/* <th className="border p-2">Anexo <br /> Evidências</th> */}
            <th className="border p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item._id} className="border hover:bg-gray-100">
              <td className="border p-2 text-center">{item.protocolo}</td>
              <td className="border p-2 text-center">{formatCNPJ(item.cnpj)} - <br /> {item.fornecedor} </td>
              <td className="border p-2 text-center">{formatDate(item.dataCriacao)}</td>
              <td className="border p-2 text-center">{formatDate(item.dataAtualizacao)}</td>
              <td className="border p-2 text-center">{item.areaResponsavel}</td>
              <td className="border p-2 text-center">
                {item.descricao.length > 30 ? `${item.descricao.substring(0, 30)}...` : item.descricao}
              </td>
              <td className="border p-2 text-center">R$ {formatNumberToDecimal(item.valor)}</td>
              <td className="border p-2 text-center">
                <span
                  className={`inline-block w-3 h-3 rounded-full 
                    ${handleStatusFlag(item) === "not_send" ?
                      "bg-red-500" :
                      handleStatusFlag(item) === "reproved" ?
                        "bg-yellow-500" :
                        handleStatusFlag(item) === "approved" ?
                          "bg-blue-500" :
                          handleStatusFlag(item) === "paid" ?
                            "bg-green-500" : "bg-gray-500"}`}
                ></span>
              </td>
              <td className="py-3 px-1 text-center flex justify-center items-center gap-2">
                <button
                  type="button"
                  className="h-8 p-1 border border-black font-medium text-sm rounded-md text-white bg-blue-400 cursor-pointer"
                  onClick={() => handleModal(item)}
                >
                  <Visibility />
                </button>
                {item.centroDeCusto !== "-" && (
                  <button
                    type="button"
                    className="h-8 p-1 border border-black font-medium text-sm rounded-md text-white bg-green-600 cursor-pointer"
                    onClick={() => handleCostModal(item)}
                  >
                    <AttachMoney />
                  </button>
                )}

              </td>
            </tr>

          ))}
        </tbody>
      </table>

      {/* Paginação */}
      <div className="flex justify-center items-center mt-4">
        <button
          className="px-3 py-1 border rounded mx-1 cursor-pointer hover:bg-gray-300"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="px-3">Página {currentPage} de {totalPages}</span>
        <button
          className="px-3 py-1 border rounded mx-1 cursor-pointer hover:bg-gray-300"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default ManagerReportDataTable;
