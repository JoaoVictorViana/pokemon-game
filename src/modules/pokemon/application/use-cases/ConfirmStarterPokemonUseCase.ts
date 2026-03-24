import { UserPokemon } from '../../domain/entities/UserPokemon'
import { UserPokemonMove } from '../../domain/entities/UserPokemonMove'
import { PokemonId } from '../../domain/value-objects/PokemonId'
import type { IPokemonRepository } from '../../infrastructure/repositories/IPokemonRepository'
import type { IPlayerProgressRepository } from '../../infrastructure/repositories/IPlayerProgressRepository'
import type { IUserPokemonRepository } from '../../infrastructure/repositories/IUserPokemonRepository'

const STARTER_LEVEL = 5
const STARTER_EXPERIENCE = 0
const STARTER_MAX_MOVES = 4
const STARTER_SHINY_PROBABILITY = 1 / 4096

export class ConfirmStarterPokemonUseCase {
  constructor(
    private readonly pokemonRepository: IPokemonRepository,
    private readonly userPokemonRepository: IUserPokemonRepository,
    private readonly playerProgressRepository: IPlayerProgressRepository
  ) {}

  async execute(pokemonId: number) {
    const alreadySelected =
      await this.playerProgressRepository.hasStarterPokemonSelected()

    if (alreadySelected) {
      return false
    }

    const pokemon = await this.pokemonRepository.getById(
      PokemonId.create(pokemonId)
    )

    const moves = [...(pokemon.moves ?? [])]
      .filter((move) => (move.level_learned_at ?? 0) <= STARTER_LEVEL)
      .sort((a, b) => (b.level_learned_at ?? 0) - (a.level_learned_at ?? 0))
      .slice(0, STARTER_MAX_MOVES)
      .map(
        (move, index) =>
          new UserPokemonMove(
            move.id.getValue(),
            index + 1,
            move.level_learned_at ?? 0
          )
      )

    const isShiny = Math.random() < STARTER_SHINY_PROBABILITY

    await this.userPokemonRepository.saveStarter(
      new UserPokemon(
        pokemon.id.getValue(),
        pokemon.name,
        STARTER_LEVEL,
        STARTER_EXPERIENCE,
        isShiny,
        pokemon.cry,
        pokemon.sprites?.front,
        pokemon.sprites?.back,
        pokemon.sprites?.front_shiny,
        pokemon.sprites?.back_shiny,
        pokemon.stats?.hp ?? 0,
        pokemon.stats?.attack ?? 0,
        pokemon.stats?.defense ?? 0,
        pokemon.stats?.special_attack ?? 0,
        pokemon.stats?.special_defense ?? 0,
        pokemon.stats?.speed ?? 0
      ),
      moves
    )

    await this.playerProgressRepository.markStarterPokemonSelected()

    return true
  }
}
