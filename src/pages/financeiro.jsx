"use client";

import { useEffect, useState } from "react";
import ManagerReportDataTable from "../app/components/ManagerReportDataTable";
import LegendTooltip from "../app/components/LegendTooptip";
import FinancialReportDataTable from "../app/components/FinancialReportDataTable";

export default function ReportPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(
                    "https://faculdadeunimed.sydle.one/api/1/main/br.edu.faculdadeUnimed.integracao/FachadaDeIntegracaoPortalDeNotas/getFinancialData",
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Basic ${process.env.NEXT_PUBLIC_PROD_KEY}`,
                            "User-Agent": "insomnia/10.3.0",
                        },
                        cache: "no-store",
                    }
                );

                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
                }

                const result = await response.json();
                console.log("Dados da API:", result);
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);


    return (
        <div className="container mx-auto">
            {data && <FinancialReportDataTable data={data} />}
        </div>
    )
}