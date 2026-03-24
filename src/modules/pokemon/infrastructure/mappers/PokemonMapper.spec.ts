import { describe, expect, it, vi } from 'vitest'
import { PokemonMapper } from './PokemonMapper'
import type { PokemonApiResponse } from '../http/pokeApi.types'
import { PokemonMove } from '../../domain/entities/PokemonMove'
import { PokemonMoveId } from '../../domain/value-objects/PokemonMoveId'
import { PokemonType } from '../../domain/entities/PokemonType'
import { PokemonTypeId } from '../../domain/value-objects/PokemonTypeId'

vi.mock('@/shared/utils/file', () => ({
  fetchAudioAsArrayBuffer: vi.fn(async () => new ArrayBuffer(8)),
  fetchSpriteAsArrayBuffer: vi.fn(async () => new ArrayBuffer(8)),
}))

describe('PokemonMapper', () => {
  it('mapeia special-attack e special-defense corretamente', async () => {
    const type = new PokemonType(
      PokemonTypeId.create(1),
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

    const move = new PokemonMove(
      PokemonMoveId.create(1),
      'tackle',
      'normal',
      40,
      35,
      100
    )

    const response: PokemonApiResponse = {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      base_experience: 64,
      cries: { latest: '/cry.ogg' },
      sprites: {
        front_default: '/front.png',
        back_default: '/back.png',
        front_shiny: '/front-shiny.png',
        back_shiny: '/back-shiny.png',
      },
      stats: [
        { base_stat: 45, stat: { name: 'hp' } },
        { base_stat: 49, stat: { name: 'attack' } },
        { base_stat: 49, stat: { name: 'defense' } },
        { base_stat: 65, stat: { name: 'special-attack' } },
        { base_stat: 65, stat: { name: 'special-defense' } },
        { base_stat: 45, stat: { name: 'speed' } },
      ],
      types: [{ slot: 1, type: { name: 'grass', url: '/type/12' } }],
      moves: [
        {
          move: { name: 'tackle', url: '/move/1' },
          version_group_details: [
            {
              level_learned_at: 1,
              version_group: { name: 'black-2-white-2' },
            },
          ],
        },
      ],
    }

    const pokemon = await PokemonMapper.fromApi(response, {
      moveRepository: {
        getById: vi.fn(),
        getByName: vi.fn(async () => move),
        listAll: vi.fn(),
        save: vi.fn(),
      },
      pokemonTypeRepository: {
        getById: vi.fn(),
        getByName: vi.fn(async () => type),
        listAll: vi.fn(),
        save: vi.fn(),
      },
    })

    expect(pokemon.stats?.special_attack).toBe(65)
    expect(pokemon.stats?.special_defense).toBe(65)
  })
})
