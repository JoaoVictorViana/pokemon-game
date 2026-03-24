import { renderHook, waitFor, act } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePokedex } from './usePokedex'
import { Pokemon } from '@/modules/pokemon/domain/entities/Pokemon'
import { PokemonId } from '@/modules/pokemon/domain/value-objects/PokemonId'
import { PokemonMove } from '@/modules/pokemon/domain/entities/PokemonMove'
import { PokemonMoveId } from '@/modules/pokemon/domain/value-objects/PokemonMoveId'
import { PokemonType } from '@/modules/pokemon/domain/entities/PokemonType'
import { PokemonTypeId } from '@/modules/pokemon/domain/value-objects/PokemonTypeId'

const listExecuteMock = vi.fn()
const fetchExecuteMock = vi.fn()

vi.mock('../../application/createPokedexDependencies', () => ({
  createPokedexDependencies: () => ({
    listPokemons: { execute: listExecuteMock },
    fetchPokemon: { execute: fetchExecuteMock },
  }),
}))

function createPokemon(id: number, name: string) {
  const grass = new PokemonType(
    PokemonTypeId.create(12),
    'grass',
    '/grass.png',
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
  )

  const tackle = new PokemonMove(
    PokemonMoveId.create(1),
    'tackle',
    'normal',
    40,
    35,
    100,
    1
  )

  return new Pokemon(
    PokemonId.create(id),
    name,
    7,
    69,
    64,
    new ArrayBuffer(8),
    {
      front: new ArrayBuffer(8),
      back: new ArrayBuffer(8),
      front_shiny: new ArrayBuffer(8),
      back_shiny: new ArrayBuffer(8),
    },
    [tackle],
    [grass],
    {
      hp: 45,
      attack: 49,
      defense: 49,
      special_attack: 65,
      special_defense: 65,
      speed: 45,
    }
  )
}

describe('usePokedex', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('carrega a lista inicial e seleciona o primeiro pokemon automaticamente', async () => {
    const bulbasaur = createPokemon(1, 'bulbasaur')
    const ivysaur = createPokemon(2, 'ivysaur')

    listExecuteMock.mockResolvedValueOnce([bulbasaur, ivysaur])
    fetchExecuteMock.mockResolvedValueOnce(bulbasaur)

    const { result } = renderHook(() => usePokedex())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(listExecuteMock).toHaveBeenCalledTimes(1)
    expect(fetchExecuteMock).toHaveBeenCalledWith(1)
    expect(result.current.pokemons).toHaveLength(2)
    expect(result.current.currentPokemon?.name).toBe('bulbasaur')
  })

  it('permite trocar o pokemon atual sob demanda', async () => {
    const bulbasaur = createPokemon(1, 'bulbasaur')
    const ivysaur = createPokemon(2, 'ivysaur')

    listExecuteMock.mockResolvedValueOnce([bulbasaur, ivysaur])
    fetchExecuteMock
      .mockResolvedValueOnce(bulbasaur)
      .mockResolvedValueOnce(ivysaur)

    const { result } = renderHook(() => usePokedex())

    await waitFor(() => {
      expect(result.current.currentPokemon?.name).toBe('bulbasaur')
    })

    await act(async () => {
      await result.current.handleChangeCurrentPokemon(2)
    })

    expect(fetchExecuteMock).toHaveBeenNthCalledWith(2, 2)
    expect(result.current.currentPokemon?.name).toBe('ivysaur')
    expect(result.current.loading).toBe(false)
  })

  it('encerra o carregamento sem buscar detalhe quando a lista vem vazia', async () => {
    listExecuteMock.mockResolvedValueOnce([])

    const { result } = renderHook(() => usePokedex())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.pokemons).toEqual([])
    expect(result.current.currentPokemon).toBeUndefined()
    expect(fetchExecuteMock).not.toHaveBeenCalled()
  })
})
