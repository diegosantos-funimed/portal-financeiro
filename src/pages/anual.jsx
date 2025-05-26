"use client";

import { useEffect, useState } from "react";
import YearReportData from "../app/components/YearReportData";
import MonthlyReportData from "../app/components/MonthlyReportTable";

export default function ReportPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(
                    "https://faculdadeunimed.sydle.one/api/1/main/br.edu.faculdadeUnimed.integracao/FachadaDeIntegracaoPortalDeNotas/getCompanyMontly",
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Basic ${process.env.NEXT_PUBLIC_PROD_KEY}`,
                            "User-Agent": "insomnia/10.3.0",
                        },
                        cache: "no-store",
                        // body: JSON.stringify({
                        //     "user_id": userName
                        // })
                    }
                );

                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
                }

                const result = await response.json();
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
        <div className="container mx-auto p-2">
            {/* {data && <YearReportData data={data} />} */}
            {data && <MonthlyReportData dadosFornecedores={data} />}
        </div>
    )
}