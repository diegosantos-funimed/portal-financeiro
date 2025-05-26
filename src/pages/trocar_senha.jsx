"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CompanyData from "../app/components/CompanyData"; // Importando o componente CompanyData

export default function ChangePassword() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();
    const userId = searchParams.get("id"); // Pegando user_name diretamente

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }
        async function fetchData() {
            try {
                const response = await fetch(
                    "https://faculdadeunimed.sydle.one/api/1/main/crm/supplier/findByCNPJ?_id=" + userId,
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
    }, [userId]);

    return (
        <div className="container mx-auto">
            {data && <CompanyData data={data.supplier} emailTypes={data.emailTypes} />}
        </div>
    )
}

