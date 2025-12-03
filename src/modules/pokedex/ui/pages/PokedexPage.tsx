import { usePokedex } from '@/shared/hooks/usePokedex'
import { PokemonList } from '../components/PokemonList'
import { PokemonDetails } from '../components/PokemonDetails'
import { useNavigate } from 'react-router'

export function PokedexPage() {
  const { currentPokemon, pokemons, handleChangeCurrentPokemon } = usePokedex()

  const navigate = useNavigate()

  if (!currentPokemon) return null

  return (
    <main className="w-full h-full flex flex-col gap-4">
      <header className="w-full h-[10%] bg-red-400 py-3 px-2 border rounded-xl text-white flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="p-3 cursor-pointer rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
        >
          {'<'}
        </button>
        Pokedex
      </header>
      <div className="flex gap-4 h-[90%] w-full">
        <PokemonList
          pokemons={pokemons}
          onSelect={handleChangeCurrentPokemon}
        />
        <PokemonDetails pokemon={currentPokemon} />
      </div>
    </main>
  )
}
