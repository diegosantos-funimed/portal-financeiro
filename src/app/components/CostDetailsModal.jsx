import formatNumberToDecimal from "../utils/formatNumberToDecimal";

const CostDetailsModal = ({ item: selectedItem, onClose }) => {
  const calcularValorPorcentagem = (valorTotal, porcentagem) => {
    return ((valorTotal * porcentagem) / 100).toFixed(2);
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center transition-opacity duration-300 opacity-100">
      <div className=" bg-white shadow-lg py-4 rounded-md w-200">
        <div className="flex justify-between border-b border-gray-300 py-3 px-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 ">
            Detalhes de centro de custo solicitação #{selectedItem.protocolo}
          </h2>
          <button
            type="button"
            className="h-8 px-3 text-sm rounded-md bg-gray-700 text-white cursor-pointer"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>

        <div className="px-5 pb-4">
          <p className="text text-gray-700">
            <strong>Valor total:</strong> R$
            {formatNumberToDecimal(selectedItem.valor)}
          </p>
          <div className="flex">
            <p className="text text-gray-700 w-full">
              {selectedItem.centroDeCusto !== "-" && (
                <div>
                  <p className="text text-gray-700">
                    <strong>Centros de custo</strong>
                  </p>
                  <div className="flex flex-col gap-2">
                    {selectedItem.centroDeCusto.map((centro, index) => (
                      <div
                        key={index}
                        className="flex md:flex-row  flex-col gap-3 border-b border-gray-300 p-2"
                      >
                        <span className="text-sm">
                          <strong>Nome:</strong> {centro.codigoDoCentroDeCustos}{" "}
                          / {centro.setor}
                        </span>
                        <span className="text-sm">
                          <strong>Valor:</strong> R$
                          {calcularValorPorcentagem(
                            selectedItem.valor,
                            centro.porcentagem
                          )}
                        </span>
                        <span className="text-sm">
                          <strong>Porcentagem:</strong> {centro.porcentagem} %
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </p>
          </div>
        </div>
        <div className="border-t border-gray-300 flex justify-between items-center px-4 pt-2"></div>
      </div>
    </div>
  );
};

export default CostDetailsModal;
