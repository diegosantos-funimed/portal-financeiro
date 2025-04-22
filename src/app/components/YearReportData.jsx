import React, { useState } from "react";

const YearReportData = ({ data, onSelect }) => {
    const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const rowsPerPage = 10;

    // 🔍 Aplica o filtro por nome ou CNPJ
    const filteredData = data.filter((fornecedor) => {
        const termo = searchTerm.toLowerCase();
        return (
            fornecedor.name.toLowerCase().includes(termo) ||
            fornecedor.cnpj.toLowerCase().includes(termo)
        );
    });

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handlePageChange = (next) => {
        setCurrentPage((prev) => {
            const newPage = prev + next;
            if (newPage < 1 || newPage > totalPages) return prev;
            return newPage;
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // volta pra página 1 ao k
    };

    return (
        <div className="container mx-auto">
            {/* 🔎 Campo de busca */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar por nome ou CNPJ..."
                    className="w-full p-2 border rounded"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            {/* 🧾 Tabela */}
            <table className="min-w-full border border-r-gray-700 mb-4">
                <thead>
                    <tr className="bg-gray-200 text-gray-700">
                        <th className="border p-2">CNPJ - Fornecedor</th>
                        {meses.map((mes) => (
                            <th key={mes} className="border p-2">{mes}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((fornecedor) => {
                        const inicioDate = new Date(fornecedor.inicioDaCobranca);
                        const anoReferencia = inicioDate.getFullYear();

                        const statusMeses = meses.map((mes, index) => {
                            const dataReferencia = new Date(anoReferencia, index, 1);

                            if (dataReferencia < new Date(inicioDate.getFullYear(), inicioDate.getMonth(), 1)) {
                                return "bg-gray-300";
                            }

                            const houveEnvio = fornecedor.envios.some((envio) => {
                                const envioDate = new Date(envio.dataCriacao);
                                return envioDate.getMonth() === index && envioDate.getFullYear() === anoReferencia;
                            });

                            return houveEnvio ? "bg-green-500" : "bg-red-500";
                        });

                        return (
                            <tr key={fornecedor.cnpj} className="border hover:bg-gray-100">
                                <td className="border p-2 text-center">
                                    {fornecedor.cnpj}
                                    <br />
                                    {fornecedor.name}
                                </td>
                                {statusMeses.map((cor, i) => (
                                    <td key={i} className="border p-2 text-center">
                                        <button
                                            className={`inline-block w-7 h-7 rounded-full hover:cursor-pointer border ${cor}`}
                                            onClick={() => onSelect(fornecedor.cnpj, i)}
                                            title={`Ver dados de ${meses[i]} para ${fornecedor.name}`}
                                        />
                                        {/* <span className={`inline-block w-7 h-7 rounded-full border ${cor}`}></span> */}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                    {currentData.length === 0 && (
                        <tr>
                            <td colSpan={meses.length + 1} className="text-center text-gray-500 p-4">
                                Nenhum fornecedor encontrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 🔸 Paginação */}
            {filteredData.length > 0 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => handlePageChange(-1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border hover:bg-gray-400 hover:cursor-pointer rounded disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="text-gray-700">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border hover:cursor-pointer hover:bg-gray-400 rounded disabled:opacity-50"
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
};

export default YearReportData;
