import React from "react";
import formatNumberToDecimal from "../utils/formatNumberToDecimal";

const CostDetailsModal = ({ item: selectedItem, onClose }) => {
  const calcularValorPorcentagem = (valorTotal, porcentagem) => {
    // Garante que o valorTotal é um número antes de calcular
    const total = parseFloat(valorTotal);
    const perc = parseFloat(porcentagem);

    if (isNaN(total) || isNaN(perc)) {
      return "0.00"; // Retorna um valor padrão ou erro se os inputs não forem válidos
    }
    return ((total * perc) / 100).toFixed(2);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center transition-opacity duration-300 opacity-100">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"> {/* max-w-2xl para maior largura, max-h e overflow para rolagem se o conteúdo for grande */}
        {/* Cabeçalho do Modal */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Detalhes de Centro de Custo # {selectedItem.protocolo}
          </h2>
          <button
            type="button"
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            onClick={onClose}
            aria-label="Fechar"
          >
            {/* Ícone de fechar consistente */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 space-y-5"> {/* Espaçamento entre seções */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-800 text-base">
              <strong className="font-semibold">Valor total da solicitação:</strong> R$
              {formatNumberToDecimal(selectedItem.valor)}
            </p>
          </div>

          {selectedItem.centroDeCusto && selectedItem.centroDeCusto.length > 0 && selectedItem.centroDeCusto !== "-" ? (
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-xl font-semibold text-gray-800 mb-4">Centros de Custo</p>
              <div className="space-y-3"> {/* Espaçamento entre os itens do centro de custo */}
                {selectedItem.centroDeCusto.map((centro, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 border border-gray-200 rounded-md bg-white shadow-sm"
                  >
                    <p className="text-sm text-gray-800">
                      <strong className="font-medium">Código / Setor:</strong> {centro.codigoDoCentroDeCustos}{" "}
                      / {centro.setor}
                    </p>
                    <p className="text-sm text-gray-800">
                      <strong className="font-medium">Valor Rateado:</strong> R$
                      {formatNumberToDecimal(
                        calcularValorPorcentagem(selectedItem.valor, centro.porcentagem)
                      )}
                    </p>
                    <p className="text-sm text-gray-800">
                      <strong className="font-medium">Porcentagem:</strong> {centro.porcentagem} %
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
              <p className="text-gray-600 text-base italic">Nenhum centro de custo associado a esta solicitação.</p>
            </div>
          )}
        </div>
        {/* Rodapé do Modal (mantido vazio como no original, se não houver botões aqui) */}
        <div className="border-t border-gray-200 p-3"></div>
      </div>
    </div>
  );
};

export default CostDetailsModal;