import { usePokedex } from '@/shared/hooks/usePokedex'
import { PokemonList } from '../components/PokemonList'
import { PokemonDetails } from '../components/PokemonDetails'

export function PokedexPage() {
  const { currentPokemon, pokemons, handleChangeCurrentPokemon } = usePokedex()

  if (!currentPokemon) return null

  return (
    <main className="w-full h-full flex flex-col gap-4">
      <header className="w-full h-[10%] bg-red-400 py-3 px-2 border rounded-xl text-white">
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
