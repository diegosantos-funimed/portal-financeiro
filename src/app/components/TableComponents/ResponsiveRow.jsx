import React from "react";
import StatusDot from "./StatusDot";
import ActionsButtons from "./ActionsButtons";
import formatDate from "../../utils/formatDate";
import formatCNPJ from "../../utils/formatCNPJ";
import formatNumberToDecimal from "../../utils/formatNumberToDecimal";

const ResponsiveRow = ({ item, onDetailsClick, onCostClick }) => {
  return (
    <>
      {/* Desktop - Tabela */}
      <tr className="border hover:bg-gray-100 hidden md:table-row">
        <td className="border p-2 text-center">{item.protocolo}</td>
        <td className="border p-2 text-center">
          {formatCNPJ(item.cnpj)} - <br /> {item.fornecedor}
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

      {/* Mobile - Card */}
      <div className="block md:hidden border rounded-md shadow p-4 mb-4 bg-white">
        <div className="font-bold text-lg border-b pb-1 mb-2">
          #{item.protocolo}
        </div>

        <div className="mb-1">
          <span className="font-semibold">CNPJ: </span>
          {formatCNPJ(item.cnpj)}
        </div>

        <div className="mb-1">
          <span className="font-semibold">Fornecedor: </span>
          {item.fornecedor}
        </div>

        <div className="mb-1">
          <span className="font-semibold">Área Responsável: </span>
          {item.areaResponsavel}
        </div>

        <div className="mb-1">
          <span className="font-semibold">Descrição: </span>
          {item.descricao.length > 50
            ? `${item.descricao.substring(0, 50)}...`
            : item.descricao}
        </div>

        <div className="mb-1">
          <span className="font-semibold">Valor: </span>
          R$ {formatNumberToDecimal(item.valor)}
        </div>

        <div className="mb-1">
          <span className="font-semibold">Data Abertura: </span>
          {formatDate(item.dataCriacao)}
        </div>

        <div className="mb-2">
          <span className="font-semibold">Última Atualização: </span>
          {formatDate(item.dataAtualizacao)}
        </div>

        <div className="flex justify-between items-center">
          <StatusDot item={item} />
          <div className="flex gap-2">
            <ActionsButtons
              item={item}
              onDetailsClick={onDetailsClick}
              onCostClick={onCostClick}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ResponsiveRow;
