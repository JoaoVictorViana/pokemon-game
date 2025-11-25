import type { Pokemon } from '@/modules/pokemon/domain/entities/Pokemon'

type Props = {
  pokemon: Pokemon
}

export function PokemonCard({ pokemon }: Props) {
  return (
    <div className="card" data-testid="pokemon-card">
      <img src={pokemon.sprite} />
      <p>{pokemon.name}</p>
    </div>
  )
}
