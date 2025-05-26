import * as Tooltip from '@radix-ui/react-tooltip';

const StatusDotTooltip = ({ status, label }) => {
  const color = status ? 'bg-green-500' : 'bg-red-500';
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span
            className={`inline-block w-3 h-3 border p-2 rounded-full hover:cursor-pointer ${color}`}
          ></span>
        </Tooltip.Trigger>
        <Tooltip.Content
          className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg"
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
