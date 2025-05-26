import React, { useState, useEffect } from "react";

const months = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
];

// Função auxiliar para mapear mês (0-11) para JAN, FEV, ...
const getMonthLabel = (date) => {
  const d = new Date(date);
  return months[d.getMonth()];
};

// Função para transformar os dados no formato correto
const transformData = (data) => {
  return data.map((item) => {
    const statusPorMes = {};
    const inicio = new Date(item.inicioDaCobranca);
    const anoCobranca = inicio.getFullYear();
    const mesCobranca = inicio.getMonth(); // 0 = Janeiro

    // Inicializa todos os meses
    months.forEach((_, index) => {
      if (index < mesCobranca) {
        statusPorMes[months[index]] = "gray"; // Antes do início da cobrança
      } else {
        statusPorMes[months[index]] = "red"; // Após ou igual ao início da cobrança, sem envio ainda
      }
    });

    // Marca os envios como verde
    item.envios.forEach((envio) => {
      const dataEnvio = new Date(envio.dataCriacao);
      const mesEnvio = dataEnvio.getMonth();
      const anoEnvio = dataEnvio.getFullYear();

      if (anoEnvio === anoCobranca) {
        const mesLabel = months[mesEnvio];
        statusPorMes[mesLabel] = "green"; // Teve envio
      }
    });

    return {
      cnpj: item.cnpj,
      fornecedor: item.name,
      statusPorMes,
    };
  });
};

const YearReportData = ({ data, onSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");

  const transformedData = transformData(data);

  // Filtro de busca
  const filteredData = transformedData.filter(
    (item) =>
      item.cnpj.includes(searchQuery) ||
      item.fornecedor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const renderStatusDot = (status) => {
    const color =
      status === "green"
        ? "bg-green-500"
        : status === "red"
        ? "bg-red-500"
        : "bg-gray-300";
    return <button className={`w-7 h-7 cursor-pointer border rounded-full ${color}`}></button>;
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nome ou CNPJ..."
          className="border rounded p-2 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Desktop */}
      <table className="min-w-full border border-gray-300 hidden md:table">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="border p-2">CNPJ - Fornecedor</th>
            {months.map((m) => (
              <th key={m} className="border p-2">
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item.cnpj} className="border">
              <td className="border p-2 text-center">
                {item.cnpj} <br /> {item.fornecedor}
              </td>
              {months.map((month, index) => (
                <td
                  key={month}
                  className="border p-2 text-center cursor-pointer"
                  onClick={() => onSelect(item.cnpj, index)}
                >
                  {renderStatusDot(item.statusPorMes[month])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile */}
      <div className="md:hidden">
        {currentData.map((item) => (
          <div
            key={item.cnpj}
            className="border rounded-md shadow p-4 mb-4 bg-white"
          >
            <div className="font-bold text-lg border-b pb-1 mb-2">
              {item.cnpj} - {item.fornecedor}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {months.map((month, index) => (
                <button
                  key={month}
                  onClick={() => onSelect(item.cnpj, index)}
                  className="flex flex-col items-center justify-center border rounded p-2"
                >
                  <span className="font-medium">{month}</span>
                  {renderStatusDot(item.statusPorMes[month])}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-center items-center mt-4">
        <button
          className="px-3 py-1 border rounded mx-1 cursor-pointer hover:bg-gray-300"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="px-3">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded mx-1 cursor-pointer hover:bg-gray-300"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default YearReportData;
