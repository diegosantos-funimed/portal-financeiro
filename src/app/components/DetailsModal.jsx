import formatDate from "../utils/formatDate";
import formatNumberToDecimal from "../utils/formatNumberToDecimal";
import formatCNPJ from "../utils/formatCNPJ";
import handleStatusFlag from "../utils/handleStatusFlag";
import {
  Download,
  Close as CloseIcon, // Renamed to avoid conflict with the component name
  OpenWith,
  FilePresent, // A more modern file icon
} from "@mui/icons-material";
import { useState, useMemo } from "react";

// Utility function to check for invalid file extensions
const isInvalidFileExtension = (fileName) => {
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
  const extension = fileName.split(".").pop()?.toLowerCase();
  return !allowedExtensions.includes(extension);
};

const DetailsModal = ({ item: selectedItem, onClose }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);

  const handleOpenFullScreen = (e) => {
    console.log("Opening full screen for file:", e.currentTarget.dataset.fileUrl);
    const fileUrl = e.currentTarget.dataset.fileUrl;
    if (fileUrl) {
      setSelectedFileUrl(fileUrl);
      setIsFullScreen(true);
    }
  };

  const { statusText, statusColorClass } = useMemo(() => {
    const statusFlag = handleStatusFlag(selectedItem);
    let text = "Erro";
    let colorClass = "bg-gray-500";

    switch (statusFlag) {
      case "not_send":
        text = "NF Pendente ou Medição reprovada";
        colorClass = "bg-red-500";
        break;
      case "sended":
        text = "NF Enviada";
        colorClass = "bg-yellow-500";
        break;
      case "totvs_id":
        text = "Lançamento TOTVs realizado";
        colorClass = "bg-blue-500";
        break;
      case "finished":
        text = "NF validada e Processo finalizado";
        colorClass = "bg-green-500";
        break;
      default:
        break;
    }
    return { statusText: text, statusColorClass: colorClass };
  }, [selectedItem]);

  console.log("Selected Item:", selectedItem);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center transition-opacity duration-300 opacity-100 z-100">
      {isFullScreen && selectedFileUrl && (
        <FullScreenViewer fileUrl={selectedFileUrl} onClose={() => setIsFullScreen(false)} />
      )}

      <div className="bg-white shadow-lg py-4 rounded-md w-300 max-h-full md:max-h-150 overflow-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Detalhes da Solicitação # {selectedItem.protocolo}
          </h2>
          <button
            type="button"
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:cursor-pointer transition-colors"
            onClick={onClose}
            aria-label="Fechar"
          >
            <CloseIcon fontSize="medium" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InfoField label="Fornecedor" value={`${formatCNPJ(selectedItem.cnpj)} - ${selectedItem.fornecedor}`} />
            <InfoField label="Solicitante" value={selectedItem.solicitante} oddRow />
            <InfoField label="Área responsável" value={selectedItem.areaResponsavel} />
            <InfoField label="Aprovador" value={selectedItem.aprovador} />
            <InfoField label="Data de Abertura" value={formatDate(selectedItem.dataCriacao)} oddRow />
            <InfoField label="Última Atualização" value={formatDate(selectedItem.dataAtualizacao)} oddRow />
            <InfoField label="Data da aprovação da medição" value={formatDate(selectedItem.dataDeAprovacaoDeMedicao)} />
            <InfoField label="Data da aprovação da nota fiscal" value={formatDate(selectedItem.dataDeAprovacaoDeNota)} />

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Valor" value={`R$ ${formatNumberToDecimal(selectedItem.valor)}`} oddRow />
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <strong className="block text-sm font-semibold text-gray-700 mb-1">Status:</strong>
              <div className="flex items-center gap-2">
                <span className={`inline-block w-4 h-4 rounded-full ${statusColorClass} border border-gray-300`}></span>
                <span className="text-gray-800 text-sm">{statusText}</span>
              </div>
            </div>
          </div>
          {selectedItem.lancamentoTOTVS && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField label="Referência de lançamento TOTVS" value={selectedItem.lancamentoTOTVS} oddRow />
              <InfoField label="Responsável TOTVS" value={selectedItem.aprovadorAdministrativo} oddRow />
            </div>
          )}

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <strong className="block text-sm font-semibold text-gray-700 mb-2">Descrição:</strong>
            <p className="text-gray-800 text-sm">{selectedItem.descricao || "Nenhuma descrição fornecida."}</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <strong className="block text-lg font-semibold text-gray-800 mb-4">Anexos</strong>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="block text-md font-semibold text-gray-700 mb-3">Medição de serviço:</span>
                <div className="flex flex-col gap-3">
                  {selectedItem.anexo && selectedItem.anexo.length > 0 ? (
                    selectedItem.anexo.map((anexo, index) => (
                      <AttachmentDisplay
                        key={index}
                        attachment={anexo}
                        protocol={selectedItem.protocolo}
                        type="solicitacao"
                        index={index}
                        onClick={handleOpenFullScreen} // Pass onClick to handle full-screen view
                      />
                    ))
                  ) : (
                    <p className="text-gray-600 text-sm italic">Nenhuma medição de serviço anexada.</p>
                  )}
                </div>
              </div>

              <div>
                <span className="block text-md font-semibold text-gray-700 mb-3">Nota Fiscal:</span>
                <div className="flex flex-col gap-3">
                  {selectedItem.anexoNF ? (
                    <AttachmentDisplay
                      attachment={selectedItem.anexoNF}
                      protocol={selectedItem.protocolo}
                      type="nf"
                      onClick={handleOpenFullScreen} // Pass onClick to handle full-screen view
                    />
                  ) : (
                    <p className="text-gray-600 text-sm italic">Nota fiscal não enviada.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;

// Helper component for displaying information fields
const InfoField = ({ label, value, oddRow = false }) => (
  <div className={`p-3 rounded-lg border border-gray-200 ${oddRow ? 'bg-gray-50' : 'bg-white'}`}>
    <strong className="block text-sm font-semibold text-gray-700 mb-1">{label}:</strong>
    <p className="text-gray-800 text-sm break-words">{value || "Não informado"}</p>
  </div>
);

// Component for rendering file attachments
const AttachmentDisplay = ({ attachment, protocol, type, index, onClick }) => {
  const handleRedirect = (protocolNumber, attachmentType, fileIndex) => {
    const url = `https://faculdadeunimed.sydle.one/api/1/main/br.edu.faculdadeUnimed.integracao/FachadaDeIntegracaoPortalDeNotas/downloadServiceFiles/?protocolo=${protocolNumber}&anexo=${attachmentType}${fileIndex !== undefined ? `&index=${fileIndex}` : ''}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 p-2 items-start md:items-center justify-between bg-gray-50 rounded-md shadow-sm border border-gray-200 w-full">
      <span className="flex items-center text-sm font-medium text-gray-800">
        <FilePresent className="text-blue-500 mr-2" fontSize="small" />
        {attachment.name}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200"
          onClick={() => handleRedirect(protocol, type, index)}
          aria-label={`Baixar ${attachment.name}`}
        >
          <Download fontSize="small" />
        </button>
        {!isInvalidFileExtension(attachment.name) && (
          <button
            type="button"
            className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors duration-200"
            // This button will be handled by the parent modal for full-screen view
            data-file-url={`https://faculdadeunimed.sydle.one/api/1/main/br.edu.faculdadeUnimed.integracao/FachadaDeIntegracaoPortalDeNotas/downloadServiceFiles/?protocolo=${protocol}&anexo=${type}${index !== undefined ? `&index=${index}` : ''}`}
            aria-label={`Abrir ${attachment.name} em tela cheia`}
            onClick={onClick}
          >
            <OpenWith fontSize="small" />
          </button>
        )}
      </div>
    </div>
  );
};

const FullScreenViewer = ({ fileUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center z-50 p-4">
      <div className="relative w-full h-full  bg-white rounded-lg shadow-2xl flex flex-col">
        <button
          type="button"
          className="absolute top-4 right-4 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors z-10"
          onClick={onClose}
          aria-label="Fechar tela cheia"
        >
          Fechar
        </button>
        {fileUrl && (
          <iframe
            src={fileUrl}
            title="Visualizador de Anexo"
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        )}
      </div>
    </div>
  );
};