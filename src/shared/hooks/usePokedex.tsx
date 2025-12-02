import { FetchPokemonUseCase } from '@/modules/pokemon/application/use-cases/FetchPokemonUseCase'
import { ListPokemonsUseCase } from '@/modules/pokemon/application/use-cases/ListPokemonsUseCase'
import type { Pokemon } from '@/modules/pokemon/domain/entities/Pokemon'
import { PokemonDBRepository } from '@/modules/pokemon/infrastructure/repositories/PokemonDBRepository'
import { useCallback, useEffect, useState } from 'react'

export function usePokedex() {
  const [pokemons, setPokemons] = useState<Partial<Pokemon>[]>([])
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon>()
  const [loading, setLoading] = useState(true)

  const handleChangeCurrentPokemon = useCallback(
    (id: number) => {
      const repo = new PokemonDBRepository()
      const useCase = new FetchPokemonUseCase(repo)
      setLoading(true)

      useCase.execute(id).then((res) => {
        setCurrentPokemon(res)
        setLoading(false)
      })
    },
    [setCurrentPokemon]
  )

  useEffect(() => {
    const repo = new PokemonDBRepository()
    const useCase = new ListPokemonsUseCase(repo)

    useCase.execute().then((res) => {
      setPokemons(res)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    handleChangeCurrentPokemon(1)
  }, [handleChangeCurrentPokemon])

  return { pokemons, currentPokemon, handleChangeCurrentPokemon, loading }
}
