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
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg"> {/* max-w-md para um tamanho mais controlado */}
          {!loading && !success && (
            <>
              <div className="flex justify-between items-center p-5 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                  Confirmar Pagamento # {selectedItem.protocolo}
                </h2>
                <button
                  type="button"
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  onClick={onClose}
                  aria-label="Fechar"
                >
                  {/* Ícone de fechar mais consistente */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
  
              <div className="p-6 text-center space-y-4">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Você deseja confirmar o pagamento dessa solicitação?
                </h1>
                <p className="text-gray-700 text-base">
                  <strong className="font-semibold">Nome do fornecedor:</strong> {selectedItem.fornecedor}
                </p>
                <p className="text-gray-700 text-base">
                  <strong className="font-semibold">Valor total:</strong> R$ {formatNumberToDecimal(selectedItem.valor)}
                </p>
              </div>
  
              <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
                {/* Botões com estilo mais moderno e na ordem usual (Cancelar à esquerda, Confirmar à direita) */}
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors duration-200 shadow-md"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors duration-200 shadow-md"
                  onClick={fetchData}
                >
                  Confirmar
                </button>
              </div>
            </>
          )}
  
          {loading && (
            <div className="flex flex-col justify-center items-center px-6 py-10">
              {/* Spinner SVG para loading */}
              <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-700 text-lg">Enviando pagamento...</p>
            </div>
          )}
  
          {success && (
            <div className="flex flex-col justify-center items-center px-6 py-10">
              {/* Ícone de sucesso SVG */}
              <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-green-700 text-lg font-semibold mb-6">Pagamento registrado com sucesso!</p>
              <button
                type="button"
                className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors duration-200 shadow-md"
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
