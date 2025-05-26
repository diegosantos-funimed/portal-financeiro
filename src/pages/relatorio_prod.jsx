"use client";

import { useEffect, useState } from "react";
import ManagerReportDataTable from "../app/components/ManagerReportDataTable";
import NewManagerReportData from "../app/components/NewManagerReportDataTable";
import { useSearchParams } from "next/navigation";

export default function ReportPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();

    const userName = searchParams.get("user_id");

    useEffect(() => {
        if (!userName) return;

        async function fetchData() {
            try {
                const response = await fetch(
                    "https://faculdadeunimed.sydle.one/api/1/main/br.edu.faculdadeUnimed.integracao/FachadaDeIntegracaoPortalDeNotas/devAPI?user_id=" + userName,
                    {
                        method: "GET",
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
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [userName]);


    return (
        <div className="container mx-auto">
            {data && <NewManagerReportData data={data} />} 
            {/* {data && <ManagerReportDataTable data={data} />} */}
        </div>
    )
}