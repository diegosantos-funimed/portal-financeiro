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
    <div className="flex flex-wrap justify-between gap-3 mb-4 p-4 bg-white shadow-md rounded-lg">
      <div className="flex gap-2 items-end" >
        <div>
          <label htmlFor="search-input" className="block mb-1 text-gray-700">
            Buscar por CNPJ, Solicitante, Protocolo, Fornecedor ou Área responsável:
          </label>
          <input
            id="search-input"
            type="text"
            className="border border-gray-300 rounded p-2 w-full focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite para buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <div>
            <label htmlFor="start-date" className="block mb-1 text-gray-700">
              Data Inicial:
            </label>
            <input
              id="start-date"
              type="date"
              className="border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block mb-1 text-gray-700">
              Data Final:
            </label>
            <input
              id="end-date"
              type="date"
              className="border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label htmlFor="status-filter" className="block mb-1 text-gray-700">
            Status:
          </label>
          <select
            id="status-filter"
            className="border border-gray-300 rounded w-48 p-2 focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="not_send">NF Pendente ou Medição reprovada</option>
            <option value="sended">NF enviada</option>
            <option value="totvs_id">Lançamento TOTVs realizado</option>
            <option value="finished">Aprovado e lançado no TOTVS</option>
          </select>
        </div>
      </div>

      <div className="mb-4 self-end">
        <LegendTooltip />
      </div>
    </div>
  );
};

export default FilterPanel;
