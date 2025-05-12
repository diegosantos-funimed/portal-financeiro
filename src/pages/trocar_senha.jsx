"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CompanyData from "../app/components/CompanyData"; // Importando o componente CompanyData

export default function ChangePassword() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();
    const cnpj = searchParams.get("cnpj"); // Pegando user_name diretamente

    useEffect(() => {
        if (!cnpj) {
            setLoading(false);
            return;
        }
        async function fetchData() {
            try {
                const response = await fetch(
                    "https://faculdadeunimed.sydle.one/api/1/main/crm/supplier/findByCNPJ?cnpj=" + cnpj,
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
                console.log("Dados da API:", result);
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [cnpj]);

    return (
        <div className="container mx-auto">
            {data && <CompanyData data={data.supplier} emailTypes={data.emails_types} />}
        </div>
    )
}