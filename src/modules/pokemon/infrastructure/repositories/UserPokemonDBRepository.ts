import { DB_TABLES, indexedDb } from '@/configs/db'
import type { UserPokemon } from '../../domain/entities/UserPokemon'
import type { UserPokemonMove } from '../../domain/entities/UserPokemonMove'
import type { IUserPokemonRepository } from './IUserPokemonRepository'

export class UserPokemonDBRepository implements IUserPokemonRepository {
  async saveStarter(pokemon: UserPokemon, moves: UserPokemonMove[]) {
    const db = await indexedDb
    const tx = db.transaction(
      [DB_TABLES.user_pokemons, DB_TABLES.user_pokemon_moves],
      'readwrite'
    )

    const userPokemonId = await tx.objectStore(DB_TABLES.user_pokemons).add({
      pokemon_id: pokemon.pokemon_id,
      name: pokemon.name,
      level: pokemon.level,
      experience: pokemon.experience,
      is_shiny: pokemon.is_shiny,
      cry: pokemon.cry,
      sprite_front: pokemon.sprite_front,
      sprite_back: pokemon.sprite_back,
      sprite_front_shiny: pokemon.sprite_front_shiny,
      sprite_back_shiny: pokemon.sprite_back_shiny,
      base_hp: pokemon.base_hp,
      base_attack: pokemon.base_attack,
      base_defense: pokemon.base_defense,
      base_special_attack: pokemon.base_special_attack,
      base_special_defense: pokemon.base_special_defense,
      base_speed: pokemon.base_speed,
      created_at: Date.now(),
    })

    const movesStore = tx.objectStore(DB_TABLES.user_pokemon_moves)

    await Promise.all(
      moves.map((move) =>
        movesStore.add({
          user_pokemon_id: userPokemonId,
          move_id: move.move_id,
          slot: move.slot,
          level_learned_at: move.level_learned_at,
        })
      )
    )

    await tx.done

    return Number(userPokemonId)
  }
}
