import type { Pokemon } from '@/modules/pokemon/domain/entities/Pokemon'
import { PokemonApiRepository } from '@/modules/pokemon/infrastructure/repositories/PokemonApiRepository'
import { useEffect, useState } from 'react'
import { FetchPokemonUseCase } from '@/modules/pokemon/application/use-cases/FetchPokemonUseCase'
import { PokemonSprites } from './PokemonSprites'

export function PokemonDetails() {
  const [pokemon, setPokemon] = useState<Pokemon>()

  useEffect(() => {
    const repo = new PokemonApiRepository()
    const useCase = new FetchPokemonUseCase(repo)

    useCase.execute(1).then(setPokemon)
  }, [])

  if (!pokemon) return

  return (
    <div>
      <PokemonSprites pokemon={pokemon} />
      <div>{pokemon?.name}</div>
      <div>{pokemon?.height}</div>
    </div>
  )
}
