import { useState } from "react";
import formatNumberToDecimal from "../utils/formatNumberToDecimal";
import { useSearchParams } from "next/navigation";

const ApprovalModal = ({ item: selectedItem, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const searchParams = useSearchParams();

    const userName = searchParams.get("user_name"); // Pegando user_name diretamente
    const calcularValorPorcentagem = (valorTotal, porcentagem) => {
        return ((valorTotal * porcentagem) / 100).toFixed(2);
    };

    async function fetchData() {
        setLoading(true);
        setSuccess(false);

        try {
            const response = await fetch(
                `https://faculdadeunimed-dev.sydle.one/api/1/main/br.edu.faculdadeUnimed.integracao/FachadaDeIntegracaoPortalDeNotas/confirmPayment?objectId=${selectedItem.id}&user_id=${userName}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Basic ${process.env.NEXT_PUBLIC_PROD_KEY}`,
                        "User-Agent": "insomnia/10.3.0",
                    },
                    cache: "no-store",
                }
            );

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Dados da API:", result);

            setSuccess(true);
        } catch (err) {
            console.log("Erro:", err);
            alert("Ocorreu um erro ao registrar o pagamento.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center transition-opacity duration-300 opacity-100">
            <div className="bg-white shadow-lg py-4 rounded-md w-96 max-w-full">
                {!loading && !success && (
                    <>
                        <h2 className="text-lg text-center font-semibold text-gray-900 border-b border-gray-300 py-3 px-4 mb-4">
                            Confirmar pagamento # {selectedItem.protocolo}
                        </h2>
                        <div className="px-5 pb-4 text-center flex flex-col gap-2">
                            <h1 className="text-xl font-bold">Você deseja confirmar o pagamento dessa solicitação?</h1>
                            <p className="text-gray-700">
                                <strong>Nome do fornecedor:</strong> {selectedItem.fornecedor}
                            </p>
                            <p className="text-gray-700">
                                <strong>Valor total:</strong> R${formatNumberToDecimal(selectedItem.valor)}
                            </p>
                        </div>
                        <div className="border-t border-gray-300 flex justify-center gap-5 items-center px-4 pt-2">
                            <button
                                type="button"
                                className="h-8 px-3 text-sm rounded-md bg-green-700 text-white cursor-pointer"
                                onClick={fetchData}
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
                    </>
                )}

                {loading && (
                    <div className="flex flex-col justify-center items-center px-6 py-10">
                        <p className="text-gray-700 text-lg">Enviando pagamento...</p>
                    </div>
                )}

                {success && (
                    <div className="flex flex-col justify-center items-center px-6 py-10">
                        <p className="text-green-700 text-lg font-semibold">Pagamento registrado com sucesso!</p>
                        <button
                            type="button"
                            className="mt-6 h-8 px-4 text-sm rounded-md bg-green-700 text-white cursor-pointer"
                            onClick={onClose}
                        >
                            Fechar
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ApprovalModal;
