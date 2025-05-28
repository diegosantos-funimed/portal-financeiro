import React, { useState, useEffect } from "react";
import YearReportData from "./OldYearReportData";
import UserDataTable from "./UserDataTable";
import ManagerReportDataTable from "./NewManagerReportDataTable";
import { ArrowBack } from "@mui/icons-material";
import formatCNPJ from "../utils/formatCNPJ";
import LegendTooltip from "./LegendTooptip";

const MonthlyReportData = ({ dadosFornecedores }) => {
    const [selectedCnpj, setSelectedCnpj] = useState(null);
    const [selectedMes, setSelectedMes] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);

    const mesesAPI = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching data for CNPJ:", selectedCnpj, "and month:", selectedMes);
            if (!selectedCnpj || !selectedMes) return;

            setLoading(true);
            try {
                const response = await fetch(`https://faculdadeunimed.sydle.one/api/1/main/br.edu.faculdadeUnimed.integracao/FachadaDeIntegracaoPortalDeNotas/getFilteredMonthData?cnpj=${selectedCnpj}&mes=${selectedMes}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Basic ${process.env.NEXT_PUBLIC_PROD_KEY}`,
                    },
                });

                const result = await response.json();
                setUserData(result);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                setUserData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedCnpj, selectedMes]);

    const handleSelect = (cnpj, mesIndex) => {
        setSelectedCnpj(cnpj);
        setSelectedMes(mesesAPI[mesIndex]);
        // setSelectedMes(mesIndex.toLowerCase());
    };

    return (
        <div>
            {selectedCnpj && selectedMes ? (
                <div className="mt-10">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                        <h3 className="text-xl font-bold mb-2">
                            Dados para {formatCNPJ(selectedCnpj)} -  {selectedMes.toUpperCase()}
                        </h3>
                        <div className="flex gap-3">
                                <LegendTooltip />
                            <button
                                onClick={() => {
                                    setSelectedCnpj(null);
                                    setSelectedMes(null);
                                }}
                                className="px-4 py-2 border hover:cursor-pointer hover:bg-gray-400 rounded disabled:opacity-50"
                            >
                                <ArrowBack /> Voltar
                            </button>
                           
                        </div>

                    </div>

                    {loading ? <p>Carregando...</p> : <ManagerReportDataTable data={userData} isFilteredData />}
                </div>
            ) : (
                <YearReportData data={dadosFornecedores} onSelect={handleSelect} />
            )}
        </div>
    );
};

export default MonthlyReportData;
