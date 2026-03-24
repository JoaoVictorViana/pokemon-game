import type { UserPokemon } from '../../domain/entities/UserPokemon'
import type { UserPokemonMove } from '../../domain/entities/UserPokemonMove'

export interface IUserPokemonRepository {
  saveStarter(pokemon: UserPokemon, moves: UserPokemonMove[]): Promise<number>
}
