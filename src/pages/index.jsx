"use client";

import { useSearchParams } from "next/navigation";
import DataTable from "../app/components/UserDataTable";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const userName = searchParams.get("user_name"); // Pegando user_name diretamente

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userName) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const response = await fetch(
          "https://faculdadeunimed-dev.sydle.one/api/1/main/br.edu.faculdadeUnimed.integracao/FachadaDeIntegracaoPortalDeNotas/getUserSolicitations",
          {
            method: "POST",
            headers: {
              "Authorization": `Basic ${process.env.NEXT_PUBLIC_API_KEY}`,
              "User-Agent": "insomnia/10.3.0",
              "X-Explorer-Account-Token": "faculdadeunimed-dev"
            },
            cache: "no-store",
            body: JSON.stringify({
              "user_id": userName
            })
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
  }, [userName]); // Agora userName está no array de dependências

  return (
    <div className="p-2 container mx-auto">
      {loading && <p>Carregando....</p>}
      {error && <p className="text-red-500">Erro: {error}</p>}
      {!loading && !error && data && <DataTable data={data} />}
    </div>
  );
}
