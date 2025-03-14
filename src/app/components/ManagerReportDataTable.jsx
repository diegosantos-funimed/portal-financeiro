import React, { useState, useEffect } from "react";
import formatDate from "../utils/formatDate";
import formatNumberToDecimal from "../utils/formatNumberToDecimal";
import formatCNPJ from "../utils/formatCNPJ";
import LegendTooltip from "./LegendTooptip";
import { Download } from "@mui/icons-material";

const ManagerReportDataTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const filteredData = data.filter(item => {
    const itemDate = new Date(item.data);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const matchesSearch =
      formatCNPJ(item.cnpj).includes(searchQuery) ||
      item.solicitante.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatDate(item.data).includes(searchQuery);

    const matchesDateRange =
      (!start || itemDate >= start) &&
      (!end || itemDate <= end);

    return matchesSearch && matchesDateRange;
  });

  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);



  const handleRedirect = (protocolNumber, nf) => {
    const url = `https://faculdadeunimed-dev.sydle.one/api/1/main/br.edu.faculdadeUnimed.integracao/FachadaDeIntegracaoPortalDeNotas/downloadServiceFiles/?protocolo=${protocolNumber}&anexo=${nf}`;
    window.open(url, "_blank");
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex content-start gap-3">
        <div className="mb-4">
          <label className="block mb-1">Buscar por CNPJ, Solicitante:</label>
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
          <select name="status_filter" id="status_filter" className="border rounded p-2 w-50">
            <option value="">Selecione uma opção</option>
            <option value="not_send">Não enviada</option>
            <option value="reproved">Reprovada</option>
            <option value="approved">Aprovada</option>
            <option value="paid">Pago</option>
          </select>
        </div>
        <div className="w-100 mb-4 self-center">
          <LegendTooltip />

        </div>
      </div>

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
          <th className="border p-2">#</th>
            <th className="border p-2">CNPJ - Solicitante</th>
            <th className="border p-2">Data</th>
            <th className="border p-2">Descrição</th>
            <th className="border p-2">Valor</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Anexo <br /> Evidências</th>
            <th className="border p-2">Anexo NF </th>

          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item._id} className="border hover:bg-gray-100">
               <td className="border p-2 text-center">
                {item.protocolo}
              </td>
              <td className="border p-2 text-center">{formatCNPJ(item.cnpj)} - <br /> {item.solicitante} </td>
              <td className="border p-2 text-center">
                {formatDate(item.data)}
              </td>
              <td className="border p-2 text-center">
                {item.descricao}
              </td>
              <td className="border p-2 text-center">
                R$ {formatNumberToDecimal(item.valor)}
              </td>


              <td className="border p-2 text-center">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${item.aprovado ? "bg-green-500" : "bg-red-500"
                    }`}
                ></span>
              </td>
              <td className="border p-2 text-center">
                {item.anexo ? (
                  <button
                    className="border p-1 rounded bg-blue-300 cursor-pointer"
                    onClick={() => handleRedirect(item.protocolo, "solicitacao")} >
                    <Download sx={{ fontSize: 20 }} />
                  </button>
                ) : "Não"}
              </td>
              <td className="border p-2 text-center">
                {item.anexoNF ? (
                  <button
                    className="border p-1 rounded bg-green-500 cursor-pointer"
                    onClick={() => handleRedirect(item.protocolo, "nf")} >
                    <Download sx={{ fontSize: 20 }} />
                  </button>
                ) : "Não"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Paginação */}
      <div className="flex justify-center items-center mt-4">
        <button
          className="px-3 py-1 border rounded mx-1 cursor-pointer hover:bg-gray-300"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="px-3">Página {currentPage} de {totalPages}</span>
        <button
          className="px-3 py-1 border rounded mx-1 cursor-pointer hover:bg-gray-300"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default ManagerReportDataTable;
