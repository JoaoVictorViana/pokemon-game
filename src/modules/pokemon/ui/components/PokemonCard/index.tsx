import type { Pokemon } from '@/modules/pokemon/domain/entities/Pokemon'
import { useEffect, useMemo } from 'react'

type Props = {
  pokemon: Pokemon
}

export function PokemonCard({ pokemon }: Props) {
  const spriteUrl = useMemo(() => {
    if (!pokemon.sprites?.front || pokemon.sprites.front.byteLength === 0) {
      return undefined
    }

    return URL.createObjectURL(
      new Blob([pokemon.sprites.front], { type: 'image/png' })
    )
  }, [pokemon.sprites?.front])

  useEffect(() => {
    return () => {
      if (spriteUrl) {
        URL.revokeObjectURL(spriteUrl)
      }
    }
  }, [spriteUrl])

  return (
    <div className="card" data-testid="pokemon-card">
      <img src={spriteUrl} alt={pokemon.name} />
      <p>{pokemon.name}</p>
    </div>
  )
}
