import formatNumberToDecimal from "../utils/formatNumberToDecimal";

const ApprovalModal = ({ item: selectedItem, onClose }) => {
    const calcularValorPorcentagem = (valorTotal, porcentagem) => {
        return ((valorTotal * porcentagem) / 100).toFixed(2);
    };
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center transition-opacity duration-300 opacity-100">
            <div className=" bg-white shadow-lg py-4 rounded-md w-200">
                <h2 className="text-lg text-center font-semibold text-gray-900 border-b border-gray-300 py-3 px-4 mb-4">
                    Confirmar pagamento # {selectedItem.protocolo}

                </h2>
                <div className="px-5 pb-4 text-center flex flex-col gap-2">
                    <h1 className=" text-1xl font-bold ">Você deseja confirmar o pagamento dessa solicitação?</h1>
                    <p className="text text-gray-700">
                        <strong>Nome do fornecedor:</strong> {selectedItem.fornecedor}
                    </p>
                    <p className="text text-gray-700">
                        <strong>Valor total:</strong> R${formatNumberToDecimal(selectedItem.valor)}
                    </p>
                </div>
                <div className="border-t border-gray-300 flex justify-center gap-5 items-center px-4 pt-2">
                <button
                        type="button"
                        className="h-8 px-3 text-sm rounded-md bg-green-700 text-white cursor-pointer"
                        onClick={onClose}
                    >
                        Confirmar
                    </button>
                    <button
                        type="button"
                        className="h-8 px-3 text-sm rounded-md bg-red-700 text-white cursor-pointer"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ApprovalModal;