import type { Pokemon } from '@/modules/pokemon/domain/entities/Pokemon'

type Props = {
  pokemons: Partial<Pokemon>[]
  onSelect: (id: number) => void
}

export function PokemonList({ pokemons, onSelect }: Props) {
  return (
    <div className="flex flex-col overflow-auto w-[30%] h-full gap-1 poke-modern-scroll px-2">
      {pokemons.map((pokemon) => (
        <div
          className="w-full text-black bg-gray-300 p-2 border rounded-xl cursor-pointer"
          id={pokemon.name}
          onClick={() => pokemon.id && onSelect(pokemon.id.getValue())}
        >
          {pokemon.name}
        </div>
      ))}
    </div>
  )
}
