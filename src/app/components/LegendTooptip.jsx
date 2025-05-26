'use client'

import { useState } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'

const LegendTooltip = () => {
  const [open, setOpen] = useState(false)

  const toggleTooltip = () => {
    setOpen((prev) => !prev)
  }

  return (
    <div className="flex justify-end p-2">
      <Tooltip.Provider>
        <Tooltip.Root open={open} onOpenChange={setOpen}>
          <Tooltip.Trigger asChild>
            <span
              className="cursor-pointer text-lg flex gap-1 items-center"
              onClick={toggleTooltip} // <-- Adiciona clique
            >
              Legenda de status -{' '}
              <span className="inline-block w-4 h-4 border rounded-full bg-green-500"></span>
            </span>
          </Tooltip.Trigger>
          <Tooltip.Content
            className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg w-80"
            side="top"
            sideOffset={5}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <span className="inline-block w-4 h-4 border rounded-full bg-red-500"></span>
                - NF Pendente ou Medição reprovada
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-4 h-4 border rounded-full bg-yellow-500"></span>
                - NF enviada
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-4 h-4 border rounded-full bg-blue-500"></span>
                - Lançamento TOTVs realizado
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-4 h-4 border rounded-full bg-green-500"></span>
                - Aprovado e lançado no TOTVS
              </div>
            </div>
            <Tooltip.Arrow className="fill-gray-800" />
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  )
}

export default LegendTooltip
