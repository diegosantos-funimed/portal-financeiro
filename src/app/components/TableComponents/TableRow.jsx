// TableRow.jsx
import React from "react";
import formatDate from "../../utils/formatDate";
import formatNumberToDecimal from "../../utils/formatNumberToDecimal";
import formatCNPJ from "../../utils/formatCNPJ";
import StatusDot from "./StatusDot";
import ActionsButtons from "./ActionsButtons";

const TableRow = ({ item, onDetailsClick, onCostClick }) => (
  <tr key={item._id} className="border hover:bg-gray-100">
    <td className="border p-2 text-center">{item.protocolo}</td>
    <td className="border p-2 text-center">
      {formatCNPJ(item.cnpj)} - <br /> {item.fornecedor}{" "}
    </td>
    <td className="border p-2 text-center">{formatDate(item.dataCriacao)}</td>
    <td className="border p-2 text-center">{formatDate(item.dataAtualizacao)}</td>
    <td className="border p-2 text-center">{item.areaResponsavel}</td>
    <td className="border p-2 text-center">
      {item.descricao.length > 30
        ? `${item.descricao.substring(0, 30)}...`
        : item.descricao}
    </td>
    <td className="border p-2 text-center">R$ {formatNumberToDecimal(item.valor)}</td>
    <td className="border p-2 text-center">
      <StatusDot item={item} />
    </td>
    <td className="py-3 px-1 text-center flex justify-center items-center gap-2">
      <ActionsButtons
        item={item}
        onDetailsClick={onDetailsClick}
        onCostClick={onCostClick}
      />
    </td>
  </tr>
);

export default TableRow;
