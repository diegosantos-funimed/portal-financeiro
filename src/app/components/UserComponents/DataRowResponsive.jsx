import React from "react";
import formatDate from "../../utils/formatDate";
import formatCNPJ from "../../utils/formatCNPJ";
import formatNumberToDecimal from "../../utils/formatNumberToDecimal";
import StatusDotTooltip from "./StatusDotTooltip";

const DataRowResponsive = ({ item, classId, onClick }) => {
  return (
    <>
      {/* Desktop */}
      <tr
        className="border hover:bg-gray-100 hover:cursor-pointer hidden md:table-row"
        onClick={() => onClick(item)}
      >
        <td className="border p-2 text-center">{item.protocolo}</td>
        <td className="border p-2 text-center">
          {classId === "67e2e09b40652a3ea4250bd5" ? (
            item.pagamentoConfirmado !== null ? (
              "Pago"
            ) : item.aprovadoNF && item.aprovadoSolicitacao ? (
              "Aprovado"
            ) : item.etapa === "Aguardando lançamento TOTVs" ? (
              "Aguardando processo interno"
            ) : (
              item.etapa
            )
          ) : (
            <>
              {formatCNPJ(item.cnpj)} - <br />
              {item.fornecedor}
            </>
          )}
        </td>
        <td className="border p-2 text-center">{formatDate(item.data)}</td>
        <td className="border p-2 text-center">
          {formatDate(item.dataAtualizacao)}
        </td>
        <td className="border p-2 text-center">
          {formatNumberToDecimal(item.valor)}
        </td>
        <td className="border p-2 text-center">
          {item.descricao.length > 30
            ? `${item.descricao.substring(0, 30)}...`
            : item.descricao}
        </td>
        <td className="border p-2 text-center">
          <StatusDotTooltip
            status={item.aprovadoSolicitacao}
            label={
              item.aprovadoSolicitacao
                ? "Medição aprovada"
                : "Medição pendente aprovação"
            }
          />
        </td>
        <td className="border p-2 text-center">
          <StatusDotTooltip
            status={item.aprovadoNF}
            label={
              item.aprovadoNF
                ? "Nota fiscal aprovada"
                : "Nota fiscal pendente aprovação"
            }
          />
        </td>
        <td className="border p-2 text-center">
          <StatusDotTooltip
            status={item.pagamentoConfirmado}
            label={
              item.pagamentoConfirmado
                ? "Solicitação paga"
                : "Solicitação não paga"
            }
          />
        </td>
      </tr>

      {/* Mobile */}
      <div
        className="block md:hidden border rounded-md shadow p-4 mb-4 bg-white hover:cursor-pointer"
        onClick={() => onClick(item)}
      >
        <div className="font-bold text-lg border-b pb-1 mb-2">
          #{item.protocolo}
        </div>

        <div className="mb-1">
          <span className="font-semibold">Fornecedor: </span>
          {formatCNPJ(item.cnpj)} - {item.fornecedor}
        </div>

        <div className="mb-1">
          <span className="font-semibold">Área: </span>
          {item.areaResponsavel}
        </div>

        <div className="mb-1">
          <span className="font-semibold">Valor: </span>R${" "}
          {formatNumberToDecimal(item.valor)}
        </div>

        <div className="mb-1">
          <span className="font-semibold">Abertura: </span>
          {formatDate(item.data)}
        </div>

        <div className="mb-1">
          <span className="font-semibold">Atualização: </span>
          {formatDate(item.dataAtualizacao)}
        </div>

        <div className="mb-2">
          <span className="font-semibold">Descrição: </span>
          {item.descricao.length > 50
            ? `${item.descricao.substring(0, 50)}...`
            : item.descricao}
        </div>

        <div className="flex md:flex-col flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Aprovação de medição: </span>
            <StatusDotTooltip
              status={item.aprovadoSolicitacao}
              label={
                item.aprovadoSolicitacao
                  ? "Medição aprovada"
                  : "Medição pendente"
              }
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-semibold">Aprovação Nota Fiscal: </span>
            <StatusDotTooltip
              status={item.aprovadoNF}
              label={
                item.aprovadoNF
                  ? "Nota fiscal aprovada"
                  : "Nota fiscal pendente"
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">Solicitação paga: </span>
            <StatusDotTooltip
              status={item.pagamentoConfirmado}
              label={
                item.pagamentoConfirmado
                  ? "Solicitação paga"
                  : "Solicitação não paga"
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DataRowResponsive;
