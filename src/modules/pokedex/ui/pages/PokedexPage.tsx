import { usePokedex } from '../hooks/usePokedex'
import { PokemonList } from '../components/PokemonList'
import { PokemonDetails } from '../components/PokemonDetails'
import { useNavigate } from 'react-router'

export function PokedexPage() {
  const { currentPokemon, pokemons, handleChangeCurrentPokemon } = usePokedex()

  const navigate = useNavigate()

  if (!currentPokemon) {
    return (
      <main className="w-full h-full flex items-center justify-center">
        Carregando Pokedex...
      </main>
    )
  }

  return (
    <main className="flex h-full w-full min-h-0 flex-col gap-4 overflow-hidden p-4">
      <header className="flex w-full flex-none items-center gap-2 rounded-xl border bg-red-400 px-2 py-3 text-white">
        <button
          onClick={() => navigate(-1)}
          className="p-3 cursor-pointer rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
        >
          {'<'}
        </button>
        Pokedex
      </header>
      <div className="flex h-full min-h-0 w-full gap-4 overflow-hidden">
        <PokemonList
          pokemons={pokemons}
          onSelect={handleChangeCurrentPokemon}
        />
        <PokemonDetails pokemon={currentPokemon} />
      </div>
    </main>
  )
}
