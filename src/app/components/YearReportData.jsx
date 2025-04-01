const YearReportData = ({ data }) => {
    console.log(data);

    const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

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
                        // Criando um objeto para armazenar o status de cada mês
                        {data.map((fornecedor) => {
                            // Convertendo inicioDaCobranca para um Date comparável
                            const inicio = new Date(fornecedor.inicioDaCobranca + "-01");
                        
                            const statusMeses = meses.reduce((acc, mes) => {
                                const dataMes = new Date("2024-" + mes + "-01"); // Supondo ano fixo ou ajustável
                        
                                if (dataMes < inicio) {
                                    acc[mes] = "bg-gray-300"; // Antes da cobrança: cinza
                                } else {
                                    const envio = fornecedor.envios.find(e => e.mes.toUpperCase().startsWith(mes));
                                    if (envio) {
                                        acc[mes] = envio.aprovada
                                            ? "bg-green-500"
                                            : envio.aprovada === null
                                            ? "bg-yellow-300"
                                            : "bg-red-500";
                                    } else {
                                        acc[mes] = "bg-red-500"; // Após início e sem envio: vermelho
                                    }
                                }
                        
                                return acc;
                            }, {});
                        
                            return (
                                <tr key={fornecedor.cnpj} className="border hover:bg-gray-100">
                                    <td className="border p-2 text-center">
                                        {fornecedor.cnpj}
                                        <br />
                                        {fornecedor.nome}
                                    </td>
                                    {meses.map((mes) => (
                                        <td key={mes} className="border p-2 text-center">
                                            <span
                                                className={`inline-block w-7 h-7 rounded-full border ${statusMeses[mes]}`}
                                            ></span>
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                        
                        return (
                            <tr key={fornecedor.cnpj} className="border hover:bg-gray-100">
                                <td className="border p-2 text-center">
                                    {fornecedor.cnpj}
                                    <br />
                                    {fornecedor.nome}
                                </td>
                                {meses.map((mes) => (
                                    <td key={mes} className={`border p-2 text-center `}>
                                        <span
                                            className={`inline-block w-7 h-7 rounded-full border ${statusMeses[mes]}`}
                                        ></span>
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
