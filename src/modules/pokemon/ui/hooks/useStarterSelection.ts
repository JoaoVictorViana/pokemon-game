import type { Pokemon } from '@/modules/pokemon/domain/entities/Pokemon'
import { useEffect, useMemo, useState } from 'react'
import { createStarterSelectionDependencies } from '../../application/createStarterSelectionDependencies'

export function useStarterSelection() {
  const dependencies = useMemo(() => createStarterSelectionDependencies(), [])
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedPokemonId, setSelectedPokemonId] = useState<number>()

  useEffect(() => {
    let active = true

    async function loadStarterPokemons() {
      const result = await dependencies.getStarterPokemons.execute()

      if (!active) {
        return
      }

      setPokemons(result)
      setLoading(false)
    }

    void loadStarterPokemons()

    return () => {
      active = false
    }
  }, [dependencies])

  async function confirmSelection() {
    if (!selectedPokemonId) {
      return false
    }

    setSubmitting(true)

    try {
      return await dependencies.confirmStarterPokemon.execute(selectedPokemonId)
    } finally {
      setSubmitting(false)
    }
  }

  function selectPokemon(id: number) {
    setSelectedPokemonId(id)
  }

  function clearSelection() {
    setSelectedPokemonId(undefined)
  }

  const selectedPokemon = pokemons.find(
    (pokemon) => pokemon.id.getValue() === selectedPokemonId
  )

  return {
    clearSelection,
    confirmSelection,
    loading,
    pokemons,
    selectPokemon,
    selectedPokemon,
    selectedPokemonId,
    submitting,
  }
}
