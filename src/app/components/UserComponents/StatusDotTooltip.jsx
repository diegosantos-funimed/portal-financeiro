import * as Tooltip from '@radix-ui/react-tooltip';

const StatusDotTooltip = ({ status, label }) => {
  const color = status ? 'bg-green-500' : 'bg-red-500';
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {/* Changed span to button to align with FinancialReportDataTable's action button style for consistency */}
          <button
            className={`w-4 h-4 flex items-center justify-center border border-black font-medium text-sm rounded-full ${color}`} // Consistent button styling for dots
            aria-label={label}
          ></button>
        </Tooltip.Trigger>
        <Tooltip.Content
          className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg" // Consistent tooltip styling
          side="top"
          sideOffset={5}
        >
          {label}
          <Tooltip.Arrow className="fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default StatusDotTooltip;