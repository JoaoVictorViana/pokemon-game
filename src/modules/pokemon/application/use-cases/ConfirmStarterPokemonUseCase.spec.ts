import { describe, expect, it, vi } from 'vitest'
import { ConfirmStarterPokemonUseCase } from './ConfirmStarterPokemonUseCase'
import { Pokemon } from '../../domain/entities/Pokemon'
import { PokemonMove } from '../../domain/entities/PokemonMove'
import { PokemonId } from '../../domain/value-objects/PokemonId'
import { PokemonMoveId } from '../../domain/value-objects/PokemonMoveId'

describe('ConfirmStarterPokemonUseCase', () => {
  it('salva o pokemon inicial com nivel, experiencia, shiny e movimentos elegiveis', async () => {
    const pokemonRepository = {
      getById: vi.fn().mockResolvedValue(
        new Pokemon(
          PokemonId.create(1),
          'bulbasaur',
          7,
          69,
          64,
          new ArrayBuffer(8),
          {
            front: new ArrayBuffer(4),
            back: new ArrayBuffer(4),
            front_shiny: new ArrayBuffer(4),
            back_shiny: new ArrayBuffer(4),
          },
          [
            new PokemonMove(PokemonMoveId.create(10), 'scratch', 'normal', 40, 35, 100, 1),
            new PokemonMove(PokemonMoveId.create(20), 'growl', 'normal', 0, 40, 100, 3),
            new PokemonMove(PokemonMoveId.create(30), 'vine-whip', 'grass', 45, 25, 100, 5),
            new PokemonMove(PokemonMoveId.create(40), 'razor-leaf', 'grass', 55, 25, 95, 7),
            new PokemonMove(PokemonMoveId.create(50), 'tackle', 'normal', 40, 35, 100, 2),
          ],
          [],
          {
            hp: 45,
            attack: 49,
            defense: 49,
            special_attack: 65,
            special_defense: 65,
            speed: 45,
          }
        )
      ),
    }
    const userPokemonRepository = {
      saveStarter: vi.fn().mockResolvedValue(1),
    }
    const playerProgressRepository = {
      hasStarterPokemonSelected: vi.fn().mockResolvedValue(false),
      markStarterPokemonSelected: vi.fn().mockResolvedValue(undefined),
    }

    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0)

    const useCase = new ConfirmStarterPokemonUseCase(
      pokemonRepository as never,
      userPokemonRepository,
      playerProgressRepository
    )

    const result = await useCase.execute(1)

    expect(result).toBe(true)
    expect(userPokemonRepository.saveStarter).toHaveBeenCalledTimes(1)

    const [savedPokemon, savedMoves] =
      userPokemonRepository.saveStarter.mock.calls[0]

    expect(savedPokemon.level).toBe(5)
    expect(savedPokemon.experience).toBe(0)
    expect(savedPokemon.is_shiny).toBe(true)
    expect(savedPokemon.base_hp).toBe(45)
    expect(savedMoves).toHaveLength(4)
    expect(savedMoves.map((move: { move_id: number }) => move.move_id)).toEqual([
      30, 20, 50, 10,
    ])
    expect(playerProgressRepository.markStarterPokemonSelected).toHaveBeenCalledTimes(1)

    randomSpy.mockRestore()
  })

  it('nao duplica o inicial quando o progresso ja foi confirmado', async () => {
    const pokemonRepository = {
      getById: vi.fn(),
    }
    const userPokemonRepository = {
      saveStarter: vi.fn(),
    }
    const playerProgressRepository = {
      hasStarterPokemonSelected: vi.fn().mockResolvedValue(true),
      markStarterPokemonSelected: vi.fn(),
    }

    const useCase = new ConfirmStarterPokemonUseCase(
      pokemonRepository as never,
      userPokemonRepository,
      playerProgressRepository
    )

    const result = await useCase.execute(4)

    expect(result).toBe(false)
    expect(pokemonRepository.getById).not.toHaveBeenCalled()
    expect(userPokemonRepository.saveStarter).not.toHaveBeenCalled()
    expect(playerProgressRepository.markStarterPokemonSelected).not.toHaveBeenCalled()
  })
})
