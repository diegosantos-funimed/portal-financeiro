// StatusDot.jsx
import React from "react";
import handleStatusFlag from "../../utils/handleStatusFlag";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useState } from "react";

const StatusDot = ({ item }) => {
  const status = handleStatusFlag(item);
  const colors = {
    not_send: "bg-red-500",
    sended: "bg-yellow-500",
    totvs_id: "bg-blue-500",
    finished: "bg-green-500",
  };
  const colorClass = colors[status] || "bg-gray-500";

  const [open, setOpen] = useState(false);

  const toggleTooltip = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root open={open} onOpenChange={setOpen}>
        <Tooltip.Trigger asChild>
          <span
            className={`inline-block w-3 h-3 p-2 border rounded-full ${colorClass}`}
            onClick={toggleTooltip}
          ></span>
        </Tooltip.Trigger>
        <Tooltip.Content
          className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg w-80"
          side="top"
          sideOffset={5}
        >
          {status === "finished"
            ? "Aprovado e lançado no TOTVS"
            : status === "totvs_id"
            ? "Lançamento TOTVs realizado"
            : status === "sended"
            ? "NF enviada"
            : status === "not_send"
            ? "NF Pendente ou Medição reprovada"
            : "Status desconhecido"}
          <Tooltip.Arrow className="fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default StatusDot;
