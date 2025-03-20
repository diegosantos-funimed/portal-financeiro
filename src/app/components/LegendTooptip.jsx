import React, { useState } from "react";

const LegendTooltip = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className=" flex justify-end p-2">
      <button
        className="btn"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        Legenda de status{" "}
        <span className="inline-block w-3 h-3 border rounded-full bg-green-500"></span>
      </button>
      {showTooltip && (
        <div className="absolute right-0 mt-6 w-80 p-2 bg-gray-800 text-white text-sm rounded transition-opacity">
          {/* <div className="flex items-center gap-1">
            <span className="inline-block w-4 h-4 border rounded-full bg-gray-500"></span>{" "}
            - Antes da data de início de cobrança
          </div> */}
          <div className="flex items-center gap-1">
            <span className="inline-block w-4 h-4 border rounded-full bg-red-500"></span>{" "}
            - Nota não enviada ou medição reprovada
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-4 h-4 border rounded-full bg-yellow-500"></span>{" "}
            - Nota enviada ou reprovada
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-4 h-4 border rounded-full bg-blue-500"></span>{" "}
            - Nota enviada e aprovada
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-4 h-4 border rounded-full bg-green-500"></span>{" "}
            - Aprovado e pago
          </div>
        </div>
      )}
    </div>
  );
};

export default LegendTooltip;
