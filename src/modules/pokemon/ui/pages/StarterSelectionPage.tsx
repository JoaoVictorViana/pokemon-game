import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'
import type { Pokemon } from '../../domain/entities/Pokemon'
import { useStarterSelection } from '../hooks/useStarterSelection'

function useSpriteUrl(sprite?: ArrayBuffer) {
  return useMemo(() => {
    if (!sprite || sprite.byteLength === 0) {
      return undefined
    }

    return URL.createObjectURL(new Blob([sprite], { type: 'image/png' }))
  }, [sprite])
}

function StarterPokemonOption({
  pokemon,
  selected,
  onSelect,
}: {
  pokemon: Pokemon
  selected: boolean
  onSelect: () => void
}) {
  const spriteUrl = useSpriteUrl(pokemon.sprites?.front)

  useEffect(() => {
    return () => {
      if (spriteUrl) {
        URL.revokeObjectURL(spriteUrl)
      }
    }
  }, [spriteUrl])

  return (
    <button
      type="button"
      onClick={onSelect}
      data-testid={`starter-option-${pokemon.id.getValue()}`}
      className={`flex min-h-0 cursor-pointer flex-col items-center justify-between rounded-3xl border px-4 py-5 transition md:px-6 md:py-6 ${
        selected
          ? 'border-amber-300 bg-amber-200/20 shadow-[0_0_30px_rgba(252,211,77,0.35)]'
          : 'border-white/10 bg-slate-950/65 hover:border-white/30 hover:bg-slate-900/70'
      }`}
    >
      <div className="flex w-full items-center justify-between text-xs text-white/70">
        <span>#{pokemon.id.getValue()}</span>
        <span>{pokemon.types?.map((type) => type.name).join(' / ')}</span>
      </div>
      {spriteUrl ? (
        <img
          src={spriteUrl}
          alt={pokemon.name}
          className={`h-24 w-24 object-contain transition md:h-32 md:w-32 ${
            selected ? 'scale-110' : 'scale-100'
          }`}
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/5 text-xs text-white/60 md:h-32 md:w-32">
          Sem sprite
        </div>
      )}
      <div className="text-center">
        <h2 className="font-pokemon text-base text-white capitalize md:text-lg">
          {pokemon.name}
        </h2>
        <p className="mt-3 text-[10px] leading-5 text-white/75 md:mt-4 md:text-xs md:leading-6">
          HP {pokemon.stats?.hp ?? 0} / ATK {pokemon.stats?.attack ?? 0} / DEF{' '}
          {pokemon.stats?.defense ?? 0}
        </p>
      </div>
    </button>
  )
}

export function StarterSelectionPage() {
  const navigate = useNavigate()
  const {
    clearSelection,
    confirmSelection,
    loading,
    pokemons,
    selectPokemon,
    selectedPokemon,
    selectedPokemonId,
    submitting,
  } = useStarterSelection()

  async function handleConfirmSelection() {
    const saved = await confirmSelection()

    if (saved) {
      navigate('/menu')
      return
    }

    navigate('/menu')
  }

  if (loading) {
    return (
      <main className="flex h-full w-full items-center justify-center text-white">
        Carregando pokemons iniciais...
      </main>
    )
  }

  return (
    <main className="flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#15304d_0%,#07101d_55%,#030712_100%)] p-4 text-white md:p-6">
      <section className="relative flex h-full w-full flex-col overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/70 p-5 shadow-2xl md:p-8">
        <header className="text-center">
          <span className="text-xs tracking-[0.4em] text-amber-300">
            LABORATORIO INICIAL
          </span>
          <h1 className="mt-4 font-pokemon text-xl text-white md:text-2xl">
            Escolha seu pokemon
          </h1>
          <p className="mt-4 text-xs leading-6 text-slate-300 md:text-sm md:leading-7">
            Selecione um dos pokemons disponiveis para iniciar sua jornada.
          </p>
        </header>

        <div className="mt-6 grid min-h-0 flex-1 gap-4 md:grid-cols-3 md:gap-6">
          {pokemons.map((pokemon) => (
            <StarterPokemonOption
              key={pokemon.id.getValue()}
              pokemon={pokemon}
              selected={selectedPokemonId === pokemon.id.getValue()}
              onSelect={() => selectPokemon(pokemon.id.getValue())}
            />
          ))}
        </div>

        {selectedPokemon ? (
          <section
            className="mt-4 flex-none rounded-3xl border border-amber-300/40 bg-amber-100/10 px-5 py-4 md:mt-6 md:px-6 md:py-5"
            data-testid="starter-confirmation"
          >
            <p className="text-xs leading-6 text-white md:text-sm">
              Voce quer escolher{' '}
              <span className="capitalize">{selectedPokemon.name}</span> como
              seu pokemon inicial?
            </p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={handleConfirmSelection}
                disabled={submitting}
                className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Salvando...' : 'Sim'}
              </button>
              <button
                type="button"
                onClick={clearSelection}
                disabled={submitting}
                className="rounded-2xl bg-white/10 px-5 py-3 text-sm text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Nao
              </button>
            </div>
          </section>
        ) : null}
      </section>
    </main>
  )
}
