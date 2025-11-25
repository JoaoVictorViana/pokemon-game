import type { ReactNode } from 'react'

export function GameLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-screen h-screen bg-[#1a1a1a] flex items-center justify-center">
      <div className="game-frame w-[50vw] h-[60vh] bg-black rounded-xl p-2 relative">
        {/* HUD */}
        <div className="absolute top-2 left-2 text-white text-xs">
          {/* Pokémon React */}
        </div>

        {/* Conteúdo da página */}
        <div className="w-full h-full flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  )
}
