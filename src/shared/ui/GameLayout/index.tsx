import type { ReactNode } from 'react'

export function GameLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#1a1a1a]">
      <div className="h-full w-full overflow-hidden bg-gray-100">
        <div className="flex h-full w-full min-h-0 min-w-0 items-stretch justify-stretch">
          {children}
        </div>
      </div>
    </div>
  )
}
