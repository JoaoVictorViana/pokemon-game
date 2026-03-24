import type { Pokemon } from '@/modules/pokemon/domain/entities/Pokemon'
import { useEffect, useMemo, useState } from 'react'
import { createPokedexDependencies } from '../../application/createPokedexDependencies'

export function usePokedex() {
  const dependencies = useMemo(() => createPokedexDependencies(), [])
  const [pokemons, setPokemons] = useState<Partial<Pokemon>[]>([])
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadPokedex() {
      setLoading(true)

      const pokemonList = await dependencies.listPokemons.execute()

      if (!active) {
        return
      }

      setPokemons(pokemonList)

      if (pokemonList[0]?.id) {
        const firstPokemon = await dependencies.fetchPokemon.execute(
          pokemonList[0].id.getValue()
        )

        if (!active) {
          return
        }

        setCurrentPokemon(firstPokemon)
      }

      setLoading(false)
    }

    loadPokedex()

    return () => {
      active = false
    }
  }, [dependencies])

  async function handleChangeCurrentPokemon(id: number) {
    setLoading(true)

    const pokemon = await dependencies.fetchPokemon.execute(id)

    setCurrentPokemon(pokemon)
    setLoading(false)
  }

  return { pokemons, currentPokemon, handleChangeCurrentPokemon, loading }
}
