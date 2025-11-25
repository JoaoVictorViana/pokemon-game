import { ListPokemonsUseCase } from '@/modules/pokemon/application/use-cases/ListPokemonsUseCase'
import type { Pokemon } from '@/modules/pokemon/domain/entities/Pokemon'
import { PokemonApiRepository } from '@/modules/pokemon/infrastructure/repositories/PokemonApiRepository'
import { useEffect, useState } from 'react'
import { PokemonCard } from '../../components/PokemonCard'

export function PokemonListPage() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])

  useEffect(() => {
    const repo = new PokemonApiRepository()
    const useCase = new ListPokemonsUseCase(repo)

    useCase.execute().then(setPokemons)
  }, [])

  return (
    <div>
      {pokemons.map((p) => (
        <PokemonCard key={p.id.getValue()} pokemon={p} />
      ))}
    </div>
  )
}
