import React from "react";
import formatCNPJ from "../utils/formatCNPJ";

const YearReportData = ({ data }) => {
    const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

    const getMonthIndex = (dateStr) => new Date(dateStr).getMonth();

    return (
        <div className="container mx-auto">
            <table className="min-w-full border border-r-gray-700">
                <thead>
                    <tr className="bg-gray-200 text-gray-700">
                        <th className="border p-2">CNPJ - Fornecedor</th>
                        {meses.map((mes) => (
                            <th key={mes} className="border p-2">{mes}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((fornecedor) => {
                        const inicioDate = new Date(fornecedor.inicioDaCobranca);
                        const anoReferencia = inicioDate.getFullYear();

                        const statusMeses = meses.map((mes, index) => {
                            const mesIndex = index;
                            const dataReferencia = new Date(anoReferencia, mesIndex, 1);

                            // Se mês é anterior ao início da cobrança → cinza
                            if (dataReferencia < new Date(inicioDate.getFullYear(), inicioDate.getMonth(), 1)) {
                                return "bg-gray-300";
                            }

                            // Verifica se existe envio neste mês
                            const houveEnvio = fornecedor.envios.some((envio) => {
                                const envioDate = new Date(envio.dataCriacao);
                                return envioDate.getMonth() === mesIndex && envioDate.getFullYear() === anoReferencia;
                            });

                            return houveEnvio ? "bg-green-500" : "bg-red-500";
                        });

                        return (
                            <tr key={fornecedor.cnpj} className="border hover:bg-gray-100">
                                <td className="border p-2 text-center">
                                    {formatCNPJ(fornecedor.cnpj)} - 
                                    <br />
                                    {fornecedor.name}
                                </td>
                                {statusMeses.map((cor, i) => (
                                    <td key={i} className="border p-2 text-center">
                                        <span className={`inline-block w-7 h-7 rounded-full border ${cor}`}></span>
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default YearReportData;
