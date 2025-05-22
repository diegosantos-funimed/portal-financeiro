// ActionsButtons.jsx
import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { AttachMoney, Visibility } from "@mui/icons-material";

const ActionsButtons = ({ item, onDetailsClick, onCostClick }) => (
  <>
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            className="h-8 p-1 border border-black font-medium text-sm rounded-md text-white bg-blue-400 cursor-pointer"
            onClick={() => onDetailsClick(item)}
          >
            <Visibility />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content
          className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg w-80"
          side="bottom"
          sideOffset={5}
        >
          <div className="flex items-center gap-1">
            Visualizar detalhes da solicitação
          </div>
          <Tooltip.Arrow className="fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>

    {item.centroDeCusto !== "-" && (
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              className="h-8 p-1 border border-black font-medium text-sm rounded-md text-white bg-green-800 cursor-pointer"
              onClick={() => onCostClick(item)}
            >
              <AttachMoney />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content
            className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg w-80"
            side="bottom"
            sideOffset={5}
          >
            <div className="flex items-center gap-1">
              Visualizar detalhes do centro de custo
            </div>
            <Tooltip.Arrow className="fill-gray-800" />
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    )}
  </>
);

export default ActionsButtons;
