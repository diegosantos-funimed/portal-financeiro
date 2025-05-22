// StatusDot.jsx
import React from "react";
import handleStatusFlag from "../../utils/handleStatusFlag";

const StatusDot = ({ item }) => {
  const status = handleStatusFlag(item);
  const colors = {
    not_send: "bg-red-500",
    sended: "bg-yellow-500",
    totvs_id: "bg-blue-500",
    finished: "bg-green-500",
  };
  const colorClass = colors[status] || "bg-gray-500";

  return (
    <span
      className={`inline-block w-3 h-3 p-2 border rounded-full ${colorClass}`}
    ></span>
  );
};

export default StatusDot;
