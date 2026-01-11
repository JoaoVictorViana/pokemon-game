import { audioEngine } from '@/shared/services/audio/AudioEngine'
import { Button } from '@/shared/ui/core/Button'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'

export function StartMenuPage() {
  const navigate = useNavigate?.() as any

  const items = [
    { id: 'find', label: 'Encontrar Pokémon', to: '/find' },
    { id: 'mine', label: 'Meus Pokémons', to: '/my-pokemons' },
    { id: 'pokedex', label: 'Pokedex', to: '/pokedex' },
    { id: 'shop', label: 'Loja', to: '/shop' },
    { id: 'credits', label: 'Créditos', to: '/credits' },
  ]

  useEffect(() => {
    audioEngine.playBGM('/sounds/start-menu.wav')
  }, [])

  const handleClick = (to: string) => {
    if (navigate) navigate(to)
    else console.log('navegar para', to)
  }

  return (
    <main className="h-full w-full  flex items-center justify-center">
      <div className="relative h-full w-full rounded-xl overflow-hidden  backdrop-blur-sm border border-white/5">
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-80"
          style={{
            backgroundImage:
              "url('/images/background/version-1.png'), linear-gradient(90deg, rgba(7,20,40,0.35), rgba(7,20,40,0.35))",
            mixBlendMode: 'overlay',
          }}
          aria-hidden
        />

        <div className="relative z-10 h-full flex flex-col md:flex-row items-stretch">
          <section className="hidden md:flex flex-1 items-center justify-center p-10 bg-gradient-to-br from-[#08283a]/30 to-transparent">
            <div className="text-center bg-white/80 rounded-full px-5 py-5">
              <h1 className="mt-6 font-pokemon text-black text-2xl md:text-3xl">
                Pokémon React
              </h1>
              <p className="mt-2 text-sm text-black/90">
                Sua aventura começa aqui
              </p>
            </div>
          </section>

          <aside className="flex-none h-full w-full md:w-96 p-6 md:p-8">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-md bg-white/10 border border-white/10 flex items-center justify-center">
                    <img
                      src="/images/pokeball.png"
                      alt="logo"
                      className="w-8 h-8"
                    />
                  </div>
                  <div>
                    <div className="text-sm text-white/80">Welcome Trainer</div>
                    <div className="text-white font-semibold">João Victor</div>
                  </div>
                </div>
              </div>

              <nav className="mt-6 space-y-3" aria-label="Main menu">
                {items.map((it) => (
                  <Button
                    key={it.id}
                    onClick={() => handleClick(it.to)}
                    className="w-full cursor-pointer text-left px-4 py-3 rounded-2xl bg-white/80 hover:bg-blue-700/80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400 transition flex items-center gap-3"
                  >
                    <span className="flex-none w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-sm text-black/80">
                      {it.label[0]}
                    </span>
                    <span className="flex-1 text-sm text-black">
                      {it.label}
                    </span>
                    <span className="text-xs text-black/60">›</span>
                  </Button>
                ))}
              </nav>

              <div className="mt-6 text-center text-xs text-white/50">
                © {new Date().getFullYear()} Pokémon React — Projeto de
                aprendizado
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default StartMenuPage
