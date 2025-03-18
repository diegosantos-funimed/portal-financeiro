import formatDate from "../utils/formatDate";
import formatNumberToDecimal from "../utils/formatNumberToDecimal";
import formatCNPJ from "../utils/formatCNPJ";
import handleStatusFlag from "../utils/handleStatusFlag";
import { Download } from "@mui/icons-material";


const DetailsModal = ({ item: selectedItem, onClose }) => {

    const handleRedirect = (protocolNumber, nf) => {
        const url = `https://faculdadeunimed-dev.sydle.one/api/1/main/br.edu.faculdadeUnimed.integracao/FachadaDeIntegracaoPortalDeNotas/downloadServiceFiles/?protocolo=${protocolNumber}&anexo=${nf}`;
        window.open(url, "_blank");
      };
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
            <div className=" bg-white shadow-lg py-4 rounded-md w-120">
                <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-300 py-3 px-4 mb-4">
                    Detalhes da Solicitação
                </h2>
                <div className="px-4 pb-4">
                    <p className="text text-gray-700">
                        <strong>CNPJ:</strong> {formatCNPJ(selectedItem.cnpj)}
                    </p>
                    <p className="text text-gray-700">
                        <strong>Protocolo:</strong> {selectedItem.protocolo}
                    </p>
                    <p className="text text-gray-700">
                        <strong>Solicitante:</strong> {selectedItem.solicitante}
                    </p>
                    <p className="text text-gray-700">
                        <strong>Data de Abertura:</strong> {formatDate(selectedItem.dataCriacao)}
                    </p>
                    <p className="text text-gray-700">
                        <strong>Última Atualização:</strong> {formatDate(selectedItem.dataAtualizacao)}
                    </p>
                    <p className="text text-gray-700">
                        <strong>Valor:</strong> R$ {formatNumberToDecimal(selectedItem.valor)}
                    </p>
                    <p className="text text-gray-700 flex items-center gap-1">
                        <strong>Status:</strong> <span
                            className={`inline-block  w-4 h-4 rounded-full border
                    ${handleStatusFlag(selectedItem) === "not_send" ?
                                    "bg-red-500" :
                                    handleStatusFlag(selectedItem) === "reproved" ?
                                        "bg-yellow-500" :
                                        handleStatusFlag(selectedItem) === "approved" ?
                                            "bg-blue-500" :
                                            handleStatusFlag(selectedItem) === "paid" ?
                                                "bg-green-500" : "bg-gray-500"}`}

                        ></span>
                        <span> - {handleStatusFlag(selectedItem) === "not_send" ?
                            "Nota não enviada ou medição reprovada" :
                            handleStatusFlag(selectedItem) === "reproved" ?
                                "Nota enviada ou reprovada" :
                                handleStatusFlag(selectedItem) === "approved" ?
                                    "Nota aprovada" :
                                    handleStatusFlag(selectedItem) === "paid" ?
                                        "Nota paga" : "bg-gray-500"}</span>
                    </p>
                    <p className="text text-gray-700">
                        <strong>Descrição:</strong> {selectedItem.descricao}
                    </p>
                    <p className="text text-gray-700">
                        <strong>Anexos</strong>
                        <div className="flex flex-col">
                            <div className="flex flex-col items-start">
                                <span className="text-sm">
                                    <strong>Medição de serviço:</strong>
                                </span>
                                <div className="flex gap-2">
                                    {selectedItem.anexo ? (
                                        <button
                                            className="border p-1 rounded bg-green-500 cursor-pointer"
                                            onClick={() => handleRedirect(selectedItem.protocolo, "solicitacao")}
                                        >
                                            <Download sx={{ fontSize: 20 }} />
                                        </button>
                                    ) : "Não"}


                                </div>

                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-sm">
                                    <strong>Nota Fiscal:</strong>
                                </span>
                                <div className="">
                                    {selectedItem.anexoNF ? (
                                        <button
                                            className="border p-1 rounded bg-blue-500 cursor-pointer"
                                            onClick={() => handleRedirect(selectedItem.protocolo, "nf")}
                                        >
                                            <Download sx={{ fontSize: 20 }} />
                                        </button>
                                    ) : "Não enviada"}

                                </div>
                            </div>
                        </div>
                    </p>
                </div>
                <div className="border-t border-gray-300 flex justify-between items-center px-4 pt-2">
                    <button
                        type="button"
                        className="h-8 px-3 text-sm rounded-md bg-gray-700 text-white cursor-pointer"
                        onClick={onClose}
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DetailsModal;