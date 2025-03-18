"use client";

import { useEffect, useState } from "react";
import ManagerReportDataTable from "../app/components/ManagerReportDataTable";
import LegendTooltip from "../app/components/LegendTooptip";
import mockedYearData from "../app/data/mockedYearData.json";
import YearReportData from "../app/components/YearReportData";

export default function ReportPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        setData(mockedYearData);
    }, [])

    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             const response = await fetch(
    //                 "https://faculdadeunimed-dev.sydle.one/api/1/main/br.edu.faculdadeUnimed.integracao/FachadaDeIntegracaoPortalDeNotas/getManagerData",
    //                 {
    //                     method: "POST",
    //                     headers: {
    //                         "Authorization": `Basic ${process.env.NEXT_PUBLIC_API_KEY}`,
    //                         "User-Agent": "insomnia/10.3.0",
    //                         "X-Explorer-Account-Token": "faculdadeunimed-dev"
    //                     },
    //                     cache: "no-store",
    //                     // body: JSON.stringify({
    //                     //     "user_id": userName
    //                     // })
    //                 }
    //             );

    //             if (!response.ok) {
    //                 throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
    //             }

    //             const result = await response.json();
    //             console.log("Dados da API:", result);
    //             setData(result);
    //         } catch (err) {
    //             setError(err.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }

    //     fetchData();
    // }, []); 


    return (
        <div className="container mx-auto p-2">
            {data && <YearReportData data={data} />}
        </div>
    )
}