import React from "react";

const DataTable = ({ data }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
          <th className="border p-2">Protocolo</th>
            <th className="border p-2">Etapa</th>
            <th className="border p-2">Data</th>
            <th className="border p-2">Aprovador do Serviço</th>
            <th className="border p-2">Área responsável</th>
            <th className="border p-2">Aprovado Medição</th>
            <th className="border p-2">Aprovado Nota Fiscal</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id} className="border hover:bg-gray-100">
              <td className="border p-2 text-center">{item.protocolo}</td>
              <td className="border p-2 text-center">
                {item.etapa}
              </td>
              <td className="border p-2 text-center">
                {formatDate(item.data)}
              </td>
              <td className="border p-2 text-center">
                {item.aprovador ?? "-"}
              </td>
              <td className="border p-2 text-center">
                {item.areaResponsavel ?? "-"}
              </td>
              <td className="border p-2 text-center">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${
                    item.aprovadoSolicitacao ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
              </td>
              <td className="border p-2 text-center">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${
                    item.aprovadoNF ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
