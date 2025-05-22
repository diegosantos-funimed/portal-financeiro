// FilterPanel.jsx
import LegendTooltip from "../LegendTooptip";

const FilterPanel = ({
    searchQuery, setSearchQuery,
    startDate, setStartDate,
    endDate, setEndDate,
    statusFilter, setStatusFilter,
    isFilteredData
  }) => {
    if (isFilteredData) return null;
    return (
      <div className="flex content-start gap-3">
        <div className="mb-4">
          <label className="block mb-1">Buscar por CNPJ, Solicitante, Protocolo ou Área responsável:</label>
          <input
            type="text"
            className="border rounded p-2 w-120"
            placeholder="Digite para buscar..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block mb-1">Data Inicial:</label>
            <input
              type="date"
              className="border rounded p-2"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1">Data Final:</label>
            <input
              type="date"
              className="border rounded p-2"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex mb-4 flex-col">
          <label className="block mb-1">Status:</label>
          <select
            className="border rounded p-2 w-50"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">Selecione uma opção</option>
            <option value="not_send">NF Pendente ou Medição reprovada</option>
            <option value="sended">NF enviada</option>
            <option value="totvs_id">Lançamento TOTVs realizado</option>
            <option value="finished">Aprovado e lançado no TOTVS</option>
          </select>
        </div>
        <div className="w-full mb-4 self-center">
          <LegendTooltip />
        </div>
      </div>
    );
  };
  
  export default FilterPanel;
  