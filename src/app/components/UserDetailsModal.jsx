import formatDate from "../utils/formatDate";
import formatNumberToDecimal from "../utils/formatNumberToDecimal";
import formatCNPJ from "../utils/formatCNPJ";
import handleStatusFlag from "../utils/handleStatusFlag";
import {
  AttachFile,
  Download,
  OpenWith,
} from "@mui/icons-material"; // Removed unused icons
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
    const allowedExtensions = [
      "pdf",
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "webp",
      "tiff",
    ];
    const extension = fileName.split(".").pop().toLowerCase();

    return !allowedExtensions.includes(extension);
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center transition-opacity duration-300 opacity-100 z-50"> {/* Added z-50 to ensure it's on top */}
      {isFullScreen && selectedFile && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/90 flex justify-center items-center z-50">
          <div className="relative w-full h-full flex flex-col">
            <button
              className="absolute top-4 right-4 bg-gray-700 text-white px-5 py-2 rounded-md cursor-pointer hover:bg-gray-800 transition-colors" // Consistent button styling
              onClick={() => setIsFullScreen(false)}
            >
              Fechar
            </button>
            <iframe src={selectedFile} className="w-full h-full"></iframe>
          </div>
        </div>
      )}
      {/* Modal content area, adjusted for consistent sizing and background */}
      <div className="bg-white shadow-lg rounded-lg w-[min(90%,_600px)] max-h-[90vh] overflow-y-auto flex flex-col"> {/* Adjusted width, max-height, and added flex-col */}
        <div className="flex justify-between items-center border-b border-gray-300 py-3 px-4 mb-4"> {/* Consistent header styling */}
          <h2 className="text-lg font-semibold text-gray-900">
            Detalhes da Solicitação # {selectedItem.protocolo}
          </h2>
          <button
            type="button"
            className="h-8 px-3 text-sm rounded-md bg-gray-700 text-white cursor-pointer hover:bg-gray-800 transition-colors" // Consistent button styling
            onClick={onClose}
          >
            Fechar
          </button>
        </div>

        <div className="px-5 pb-4 flex-grow"> {/* flex-grow to allow content to take available space */}
          {/* Each info row consistent with FinancialReportDataTable details modal */}
          <div className="flex flex-col border border-gray-300 rounded-md overflow-hidden mb-4"> {/* Grouped all info items into one bordered container */}
            <div className="flex flex-wrap p-2 border-b border-gray-200">
              <p className="text-sm text-gray-700 w-full md:w-1/2">
                <strong>Fornecedor:</strong> {formatCNPJ(selectedItem.cnpj)} -{" "}
                {selectedItem.fornecedor}
              </p>
              <p className="text-sm text-gray-700 w-full md:w-1/2">
                <strong>Solicitante:</strong> {selectedItem.solicitante}
              </p>
            </div>
            <div className="flex flex-wrap p-2 border-b border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-700 w-full md:w-1/2">
                <strong>Área responsável:</strong> {selectedItem.areaResponsavel}
              </p>
              <p className="text-sm text-gray-700 w-full md:w-1/2">
                <strong>Aprovador:</strong> {selectedItem.aprovador}
              </p>
            </div>
            <div className="flex flex-wrap p-2 border-b border-gray-200">
              <p className="text-sm text-gray-700 w-full md:w-1/2">
                <strong>Data de Abertura:</strong> {formatDate(selectedItem.data)}
              </p>
              <p className="text-sm text-gray-700 w-full md:w-1/2">
                <strong>Última Atualização:</strong>{" "}
                {formatDate(selectedItem.dataAtualizacao)}
              </p>
            </div>
            <div className="flex flex-wrap p-2 border-b border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-700 w-full md:w-1/2">
                <strong>Data da aprovação da medição:</strong>{" "}
                {formatDate(selectedItem.dataDeAprovacaoDeMedicao)}
              </p>
              <p className="text-sm text-gray-700 w-full md:w-1/2">
                <strong>Data da aprovação da nota fiscal:</strong>{" "}
                {formatDate(selectedItem.dataDeAprovacaoDeNota)}
              </p>
            </div>
            <div className="flex flex-wrap p-2 border-b border-gray-200">
              <p className="text-sm text-gray-700 w-full md:w-1/2">
                <strong>Valor:</strong> R${" "}
                {formatNumberToDecimal(selectedItem.valor)}
              </p>
              <p className="text-sm text-gray-700 flex items-center gap-1 w-full md:w-1/2">
                <strong>Status:</strong>{" "}
                <span
                  className={`inline-block w-4 h-4 rounded-full border
                      ${
                        handleStatusFlag(selectedItem) === "not_send"
                          ? "bg-red-500"
                          : handleStatusFlag(selectedItem) === "sended"
                          ? "bg-yellow-500"
                          : handleStatusFlag(selectedItem) === "totvs_id"
                          ? "bg-blue-500"
                          : handleStatusFlag(selectedItem) === "finished"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                ></span>
                <span>
                  {" "}
                  -{" "}
                  {handleStatusFlag(selectedItem) === "not_send"
                    ? "NF Pendente ou Medição reprovada"
                    : handleStatusFlag(selectedItem) === "sended"
                    ? "NF Enviada"
                    : handleStatusFlag(selectedItem) === "totvs_id"
                    ? "Aguardando aprovação de nota fiscal"
                    : handleStatusFlag(selectedItem) === "finished"
                    ? "NF validada e Processo finalizado"
                    : "Erro"}
                </span>
              </p>
            </div>
            <div className="p-2"> {/* No border-l/r/t as it's part of the grouped container */}
              <p className="text-sm text-gray-700">
                <strong>Descrição:</strong> {selectedItem.descricao}
              </p>
            </div>
          </div>
          
          <div className="border border-gray-300 rounded-md p-2 mb-4"> {/* Consistent attachments section styling */}
            <p className="text-sm font-semibold text-gray-900 mb-2">Anexos</p>
            <div className="flex w-full flex-col md:flex-row gap-4">
              <div className="flex flex-col w-full md:w-1/2">
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-800 mb-1">
                    Medição de serviço:
                  </span>
                  <div className="flex flex-col gap-2 w-full"> {/* Changed w-90p to w-full */}
                    {selectedItem.anexo && selectedItem.anexo.length > 0 ? (
                      selectedItem.anexo.map((anexo, index) => (
                        <div
                          key={index}
                          className="flex flex-col md:flex-row items-start md:items-center justify-between p-2 border border-gray-200 rounded-md" // Added consistent item styling
                        >
                          <span className="text-sm text-gray-700 flex items-center gap-1">
                            <AttachFile fontSize="small" /> {anexo.name}{" "}
                          </span>
                          <div className="flex gap-2 mt-2 md:mt-0">
                            <button
                              className="h-8 w-8 flex items-center justify-center p-1 border border-black font-medium text-sm rounded-md text-white bg-blue-400 hover:bg-blue-500 transition-colors" // Consistent button styling
                              onClick={() =>
                                handleRedirect(
                                  selectedItem.protocolo,
                                  "solicitacao",
                                  index
                                )
                              }
                            >
                              <Download fontSize="small" />
                            </button>
                            {!isInvalidFileExtension(anexo.name) && (
                              <button
                                className="h-8 w-8 flex items-center justify-center p-1 border border-black font-medium text-sm rounded-md text-white bg-green-700 hover:bg-green-800 transition-colors" // Consistent button styling
                                onClick={() =>
                                  openFullScreen(
                                    selectedItem.protocolo,
                                    "solicitacao",
                                    index
                                  )
                                }
                              >
                                <OpenWith fontSize="small" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-gray-700 p-2">Nenhum anexo de medição de serviço.</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start w-full md:w-1/2">
                <span className="text-sm font-semibold text-gray-800 mb-1">
                  Nota Fiscal:
                </span>
                <div className="flex flex-col gap-2 w-full"> {/* Changed w-90p to w-full */}
                  {selectedItem.anexoNF ? (
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-2 border border-gray-200 rounded-md"> {/* Added consistent item styling */}
                      <span className="text-sm text-gray-700 flex items-center gap-1">
                        <AttachFile fontSize="small" /> {selectedItem.anexoNF.name}{" "}
                      </span>

                      <div className="flex gap-2 mt-2 md:mt-0">
                        <button
                          className="h-8 w-8 flex items-center justify-center p-1 border border-black font-medium text-sm rounded-md text-white bg-blue-400 hover:bg-blue-500 transition-colors" // Consistent button styling
                          onClick={() =>
                            handleRedirect(selectedItem.protocolo, "nf")
                          }
                        >
                          <Download fontSize="small" />
                        </button>
                        {!isInvalidFileExtension(selectedItem.anexoNF.name) && ( // Check for invalid extension for NF too
                          <button
                            className="h-8 w-8 flex items-center justify-center p-1 border border-black font-medium text-sm rounded-md text-white bg-green-700 hover:bg-green-800 transition-colors" // Consistent button styling
                            onClick={() =>
                              openFullScreen(selectedItem.protocolo, "nf")
                            }
                          >
                            <OpenWith fontSize="small" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="p-2 text-sm text-gray-700">Não enviada</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-300 flex justify-end items-center px-4 pt-2"> {/* Consistent footer styling */}
          <button
            type="button"
            className="h-8 px-3 text-sm rounded-md bg-gray-700 text-white cursor-pointer hover:bg-gray-800 transition-colors"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;