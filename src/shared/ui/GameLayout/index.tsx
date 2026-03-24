import type { ReactNode } from 'react'
import { AudioControlButton } from '../AudioControlButton'

export function GameLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#1a1a1a]">
      <div className="h-full w-full overflow-hidden bg-gray-100">
        {/* HUD */}
        <div className="absolute top-2 right-2 z-50">
          <AudioControlButton />
        </div>

        {/* Conteudo da pagina */}
        <div className="flex h-full w-full min-h-0 min-w-0 items-stretch justify-stretch">
          {children}
        </div>
      </div>
    </div>
  )
}
