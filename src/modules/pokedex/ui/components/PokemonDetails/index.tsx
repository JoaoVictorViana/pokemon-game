import type { Pokemon } from '@/modules/pokemon/domain/entities/Pokemon'
import { PokemonSprites } from './PokemonSprites'
import { POKEMON_TYPE_COLORS } from '@/modules/pokemon/enums'

type Props = {
  pokemon: Pokemon
}

export function PokemonDetails({ pokemon }: Props) {
  return (
    <div className="flex flex-col justify-between gap-2 w-full h-full">
      <section className="flex justify-between px-4 gap-4 w-full h-full">
        <div>
          <PokemonSprites pokemon={pokemon} />
        </div>
        <div className="flex flex-col gap-2 w-full h-full">
          <div className="bg-red-400 py-4 rounded-xl px-3 w-full text-white">
            #{pokemon.id.getValue()} - {pokemon.name}
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex gap-2">
              {pokemon.types?.map((type) => (
                <div key={type.name}>
                  <img className="w-20" src={type.sprite} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full h-full border p-3 rounded-xl">
            <h2>Status Base</h2>
            <div className="grid grid-cols-2 gap-4">
              <span>Altura:{pokemon.height / 10}m</span>
              <span>Peso:{(pokemon.weight * 0.1).toFixed(2)}kg</span>
              <span>HP:{pokemon.stats?.hp}</span>
              <span>Attack:{pokemon.stats?.attack}</span>
              <span>Defense:{pokemon.stats?.defense}</span>
              <span>Sp. Attack:{pokemon.stats?.special_attack}</span>
              <span>Sp. Defense:{pokemon.stats?.special_defense}</span>
              <span>Speed:{pokemon.stats?.speed}</span>
            </div>
          </div>
        </div>
      </section>
      <footer className="flex flex-col w-full h-[50%] bg-red-400 p-2 gap-4 rounded-xl">
        <h2 className="text-white">Movimentos</h2>
        <div className="flex flex-wrap gap-2 overflow-auto poke-modern-scroll h-full">
          {pokemon.moves?.map((move) => (
            <span
              key={move.name}
              className={`p-2 border rounded-full text-[8px] items-center`}
              style={{
                background: POKEMON_TYPE_COLORS[move.type],
              }}
            >
              {move.name}
            </span>
          ))}
        </div>
      </footer>
    </div>
  )
}
