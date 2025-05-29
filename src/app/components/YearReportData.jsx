import React, { useState, useEffect, useMemo } from "react";
import * as Tooltip from "@radix-ui/react-tooltip"; // Added Tooltip for consistency
// Removed formatCNPJ, formatNumberToDecimal, formatDate as they are not used in YearReportData

const months = [
  "JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ",
];

// Função auxiliar para mapear mês (0-11) para JAN, FEV, ...
const getMonthLabel = (dateString) => {
  // Adiciona "T00:00:00Z" para garantir que a data seja tratada como UTC
  // Isso evita que o fuso horário local "empurre" a data para o dia/mês anterior
  const d = new Date(dateString + "T00:00:00Z");
  return months[d.getUTCMonth()]; // Use getUTCMonth() para pegar o mês UTC
};

// Função para transformar os dados no formato correto
const transformData = (data) => {
  return data.map((item) => {
    const statusPorMes = {};

    // Inicializa todos os meses com status "gray" (sem envio)
    months.forEach((month) => {
      statusPorMes[month] = "gray"; // Inicialmente, todos os meses são cinza
    });

    let firstSentMonthIndex = -1; // Para identificar o índice do primeiro mês com envio

    // Marca os meses com os envios como "green"
    item.registrosPorMes.forEach((registro) => {
      const mesEnvio = getMonthLabel(registro.month); // Mapeia o mês para "JAN", "FEV", etc.
      statusPorMes[mesEnvio] = "green"; // Marca o mês como "green" onde houve envio
      
      // Atualiza o índice do primeiro mês com envio, se for anterior ao que já temos
      const currentMonthIndex = months.indexOf(mesEnvio);
      if (firstSentMonthIndex === -1 || currentMonthIndex < firstSentMonthIndex) {
        firstSentMonthIndex = currentMonthIndex;
      }
    });

    // Marca os meses seguintes ao primeiro envio como "red"
    if (firstSentMonthIndex !== -1) {
      // Começa a partir do mês seguinte ao primeiro envio e vai até o final
      months.slice(firstSentMonthIndex + 1).forEach((month) => {
        // Apenas marca como red se o mês não for green (ou seja, se não houve envio)
        if (statusPorMes[month] !== "green") {
          statusPorMes[month] = "red";
        }
      });
    }

    return {
      cnpj: item.cnpj,
      fornecedor: item.empresaNome,
      statusPorMes,
    };
  });
};

// Componente de Filtro (Replicando TableFilters de FinancialReportDataTable)
const YearReportTableFilters = ({
  searchQuery,
  setSearchQuery,
}) => {
  // Não há startDate, endDate, statusFilter em YearReportData, então não os incluímos
  return (
    <div className="flex flex-wrap gap-3 mb-4"> {/* Removed padding, background, shadow, and rounded corners to match the main container for filters in FinancialReportDataTable */}
        <label htmlFor="search-input" className="block mb-1 text-gray-700">
          Buscar por CNPJ ou Fornecedor:
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
  );
};

// Componente de Paginação (Replicando TablePagination de FinancialReportDataTable)
const YearReportTablePagination = ({ currentPage, totalPages, setCurrentPage }) => (
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

const YearReportData = ({ data, onSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");

  const transformedData = useMemo(() => transformData(data), [data]);

  // Filtro de busca usando useMemo para otimização
  const filteredData = useMemo(() => {
    return transformedData.filter(
      (item) =>
        item.cnpj.includes(searchQuery) ||
        item.fornecedor.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transformedData, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const renderStatusDot = (status) => {
    let colorClass = "";
    let tooltipText = "";

    if (status === "green") {
      colorClass = "bg-green-500";
      tooltipText = "NF enviada no mês";
    } else if (status === "red") {
      colorClass = "bg-red-500";
      tooltipText = "NF pendente de envio ou medição reprovada";
    } else { // gray
      colorClass = "bg-gray-300";
      tooltipText = "Não aplicável ou sem dados de envio";
    }

    return (
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              className={`w-7 h-7 flex items-center justify-center p-1 border border-black font-medium text-sm rounded-full ${colorClass}`}
              aria-label={tooltipText}
            ></button>
          </Tooltip.Trigger>
          <Tooltip.Content
            className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg max-w-xs"
            side="bottom"
            sideOffset={5}
          >
            {tooltipText}
            <Tooltip.Arrow className="fill-gray-800" />
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  };

  return (
    <div className="overflow-x-auto p-4 bg-white shadow-md rounded-lg"> {/* Main container styling */}
      {/* Filters */}
      <YearReportTableFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="flex justify-between items-center mb-2 p-2">
        <div id="total">
          <span>Total de registros: <span className="font-bold text-lg">{filteredData.length}</span> </span>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block"> {/* Hide on small screens */}
        <table className="min-w-full border border-gray-300 divide-y divide-gray-200 rounded-md overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                CNPJ - Fornecedor
              </th>
              {months.map((m) => (
                <th key={m} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <tr key={item.cnpj} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.cnpj} <br /> {item.fornecedor}
                  </td>
                  {months.map((month) => (
                    <td
                      key={month}
                      className="px-4 py-4 whitespace-nowrap text-sm text-center"
                      // onClick is handled here as per original YearReportData functionality
                      onClick={() => onSelect(item.cnpj, month)}
                    >
                      {renderStatusDot(item.statusPorMes[month])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={months.length + 1} className="px-4 py-6 text-center text-gray-500 text-lg">
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
              key={item.cnpj}
              className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200"
            >
              <div className="font-bold text-lg border-b pb-1 mb-2 text-gray-800">
                {item.cnpj} - {item.fornecedor}
              </div>

              <div className="grid grid-cols-3 gap-3"> {/* Consistent grid layout */}
                {months.map((month) => (
                  <button
                    key={month}
                    onClick={() => onSelect(item.cnpj, month)}
                    className="flex flex-col items-center justify-center border border-gray-300 rounded p-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-700 mb-1">{month}</span>
                    {renderStatusDot(item.statusPorMes[month])}
                  </button>
                ))}
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
        <YearReportTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default YearReportData;