import formatDate from "../utils/formatDate";
import formatNumberToDecimal from "../utils/formatNumberToDecimal";
import formatCNPJ from "../utils/formatCNPJ";
import handleStatusFlag from "../utils/handleStatusFlag";
import { AttachFile, Download, InsertDriveFile, InsertDriveFileOutlined, OpenWith, PlayCircle } from "@mui/icons-material";
import { useState } from "react";


const UserDetailsModal = ({ item: selectedItem, onClose }) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleRedirect = (protocolNumber, nf, index) => {
        const url = `https://faculdadeunimed.sydle.one/api/1/main/br.edu.faculdadeUnimed.integracao/FachadaDeIntegracaoPortalDeNotas/downloadServiceFiles/?protocolo=${protocolNumber}&anexo=${nf}&index=${index}`;
        window.open(url, "_blank");
    };

    const openFullScreen = (protocolNumber, nf, index) => {
        const url = `https://faculdadeunimed.sydle.one/api/1/main/br.edu.faculdadeUnimed.integracao/FachadaDeIntegracaoPortalDeNotas/downloadServiceFiles/?protocolo=${protocolNumber}&anexo=${nf}&index=${index}`;

        setSelectedFile(url);
        setIsFullScreen(true);
    };

    function isInvalidFileExtension(fileName) {
        const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff'];
        const extension = fileName.split('.').pop().toLowerCase();

        return !allowedExtensions.includes(extension);
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center transition-opacity duration-300 opacity-100">
            {isFullScreen && selectedFile && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/90 flex justify-center items-center z-50">
                    <div className="relative w-full h-full flex flex-col">
                        <button
                            className="absolute top-3 right-4 bg-gray-700 text-white px-5 py-2 rounded-md cursor-pointer"
                            onClick={() => setIsFullScreen(false)}
                        >
                            Fechar
                        </button>
                        <iframe src={selectedFile} className="w-full h-full"></iframe>
                    </div>
                </div>
            )}
            <div className=" bg-white shadow-lg py-4 rounded-md w-240">
                <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-300 py-3 px-4 mb-4">
                    Detalhes da Solicitação # {selectedItem.protocolo}

                </h2>
                <div className="px-5 pb-4">
                    <div className="flex border p-1">
                        <p className="text text-gray-700 w-full">
                            <strong>Fornecedor :</strong> {formatCNPJ(selectedItem.cnpj)} - {selectedItem.fornecedor}
                        </p>

                    </div>
                    <div className="flex border-l border-r p-1 bg-gray-200">
                        <p className="text text-gray-700 ">
                            <strong>Solicitante:</strong> {selectedItem.solicitante}
                        </p>
                    </div>
                    <div className="flex border p-1">
                        <p className="text text-gray-700 w-1/2">
                            <strong>Área responsável:</strong> {selectedItem.areaResponsavel}
                        </p>
                        <p className="text text-gray-700 w-1/2">
                            <strong>Aprovador:</strong> {selectedItem.aprovador}
                        </p>
                    </div>
                    <div className="flex border-r border-l p-1 bg-gray-200 ">
                        <p className="text text-gray-700 w-1/2">
                            <strong>Data de Abertura:</strong> {formatDate(selectedItem.data)}
                        </p>
                        <p className="text text-gray-700 w-1/2">
                            <strong>Última Atualização:</strong> {formatDate(selectedItem.dataAtualizacao)}
                        </p>
                    </div>
                    <div className="flex border-t border-r border-l p-1 ">
                        <p className="text text-gray-700 w-1/2">
                            <strong>Data da aprovação da medição:</strong> {formatDate(selectedItem.dataDeAprovacaoDeMedicao)}
                        </p>
                        <p className="text text-gray-700 w-1/2">
                            <strong>Data da aprovação da nota fiscal:</strong> {formatDate(selectedItem.dataDeAprovacaoDeNota)}
                        </p>
                    </div>
                    <div className="flex border p-1 bg-gray-200">
                        <p className="text text-gray-700 w-1/2">
                            <strong>Valor:</strong> R$ {formatNumberToDecimal(selectedItem.valor)}
                        </p>
                        <p className="text text-gray-700 flex items-center gap-1 w-1/2">
                            <strong>Status:</strong> <span
                                className={`inline-block  w-4 h-4 rounded-full border
                    ${handleStatusFlag(selectedItem) === "not_send" ?
                                        "bg-red-500" :
                                        handleStatusFlag(selectedItem) === "sended" ?
                                            "bg-yellow-500" :
                                            handleStatusFlag(selectedItem) === "totvs_id" ?
                                                "bg-blue-500" :
                                                handleStatusFlag(selectedItem) === "finished" ?
                                                    "bg-green-500" : "bg-gray-500"}`}

                            ></span>
                            <span> - {handleStatusFlag(selectedItem) === "not_send" ?
                                "NF Pendente ou Medição reprovada" :
                                handleStatusFlag(selectedItem) === "sended" ?
                                    "NF Enviada" :
                                    handleStatusFlag(selectedItem) === "totvs_id" ?
                                        "Lançamento TOTVs realizado" :
                                        handleStatusFlag(selectedItem) === "finished" ?
                                            "NF validada e Processo finalizado" : "Erro"}</span>
                        </p>
                    </div>
                    {/* {selectedItem.lancamentoTOTVS && (
                        <div className="flex bg-gray-200 border-b border-r border-l p-1 ">
                            <p className="text text-gray-700 w-1/2">
                                <strong>Referência de lançamento TOTVS:</strong> {selectedItem.lancamentoTOTVS}
                            </p>
                        </div>
                    )} */}

                    <p className="text  text-gray-700 border-l border-r p-1">
                        <strong>Descrição:</strong> {selectedItem.descricao}
                    </p>
                    <p className="text text-gray-700 border p-2 ">
                        <strong>Anexos</strong>
                        <div className="flex w-full">
                            <div className="flex flex-col w-1/2">
                                <div className="flex flex-col items-start">
                                    <span className="text-sm">
                                        <strong>Medição de serviço:</strong>
                                    </span>
                                    <div className="flex flex-col gap-2  rounded w-90p">
                                        {selectedItem.anexo.map((anexo, index) => (
                                            <div key={index} className="flex gap-2 p-1 items-center justify-between ">
                                                <span className="text-sm"><AttachFile /> {anexo.name} </span>
                                                {selectedItem.anexo ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="border border-gray-400 p-1 rounded hover:bg-gray-600 hover:text-white cursor-pointer"
                                                            onClick={() => handleRedirect(selectedItem.protocolo, "solicitacao", index)}
                                                        >
                                                            <Download sx={{ fontSize: 20 }} />
                                                        </button>
                                                        {!isInvalidFileExtension(anexo.name) && (
                                                            <button
                                                                className="border border-gray-400  p-1 rounded hover:bg-gray-600 hover:text-white cursor-pointer"
                                                                onClick={() => openFullScreen(selectedItem.protocolo, "solicitacao", index)}
                                                            >
                                                                <OpenWith sx={{ fontSize: 20 }} />
                                                            </button>
                                                        )}

                                                    </div>
                                                ) : "Não"}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-start w-1/2">
                                <span className="text-sm">
                                    <strong>Nota Fiscal:</strong>
                                </span>
                                <div className="flex w-90p">
                                    {selectedItem.anexoNF ? (
                                        <div className="flex gap-2 p-1 items-center justify-between w-100">

                                            <span> <InsertDriveFileOutlined /> {selectedItem.anexoNF.name} </span>

                                            <div className="flex gap-2">
                                                <button
                                                    className="border border-gray-400 p-1 rounded hover:bg-gray-600 hover:text-white cursor-pointer"
                                                    onClick={() => handleRedirect(selectedItem.protocolo, "nf")}
                                                >
                                                    <Download sx={{ fontSize: 20 }} />
                                                </button>
                                                <button
                                                    className="border border-gray-400  p-1 rounded hover:bg-gray-600 hover:text-white cursor-pointer"
                                                    onClick={() => openFullScreen(selectedItem.protocolo, "nf")}
                                                >
                                                    <OpenWith sx={{ fontSize: 20 }} />
                                                </button>
                                            </div>


                                        </div>
                                    ) : (
                                        <span className="p-2">
                                            Não enviada
                                        </span>
                                    )}
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

export default UserDetailsModal;