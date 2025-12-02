import { Pokemon } from '../../domain/entities/Pokemon'
import { PokemonId } from '../../domain/values-objetcts/PokemonId'
import type { IPokemonRepository } from './IPokemonRepository'
import { DB_TABLES, indexedDb } from '@/configs/db'
import { PokemonMoveId } from '../../domain/values-objetcts/PokemonMoveId'
import { PokemonMapper } from '../mappers/PokemonMapper'
import { MoveDBRepository } from './MoveDBRepository'
import { PokemonTypeDBRepository } from './PokemonTypeDBRepository'
import { PokemonTypeId } from '../../domain/values-objetcts/PokemonTypeId'
import type { PokemonType } from '../../domain/entities/PokemonType'

export class PokemonDBRepository implements IPokemonRepository {
  async getById(id: PokemonId): Promise<Pokemon> {
    const db = await indexedDb
    const tx = db.transaction(DB_TABLES.pokemons, 'readonly')
    const store = tx.objectStore(DB_TABLES.pokemons)
    const pokemon = await store.get(id.getValue())
    const txMove = db.transaction(DB_TABLES.pokemon_moves, 'readonly')
    const storeMove = txMove.objectStore(DB_TABLES.pokemon_moves)
    const moveIndex = storeMove.index('pokemon_id')
    const movesDB = await moveIndex.getAll(pokemon.id)

    const moveRepository = new MoveDBRepository()
    const pokemonTypeRepository = new PokemonTypeDBRepository()

    const moves = await Promise.all(
      movesDB.map(async (moveDb: any) =>
        moveRepository.getById(PokemonMoveId.create(moveDb.move_id))
      )
    )

    const types: PokemonType[] = []

    types.push(
      await pokemonTypeRepository.getById(
        PokemonTypeId.create(pokemon.first_type_id)
      )
    )

    if (pokemon.second_type_id) {
      types.push(
        await pokemonTypeRepository.getById(
          PokemonTypeId.create(pokemon.second_type_id)
        )
      )
    }

    return new Pokemon(
      PokemonId.create(pokemon.id),
      pokemon.name,
      pokemon.height,
      pokemon.weight,
      pokemon.base_experience,
      pokemon.cry,
      {
        front: pokemon.sprite_front,
        back: pokemon.sprite_back,
        back_shiny: pokemon.sprite_back_shiny,
        front_shiny: pokemon.sprite_front_shiny,
      },
      moves,
      types,
      {
        hp: pokemon.base_hp,
        attack: pokemon.base_attack,
        defense: pokemon.base_defense,
        special_attack: pokemon.base_special_attack,
        special_defense: pokemon.base_special_defense,
        speed: pokemon.base_speed,
      }
    )
  }

  async listAll(): Promise<Partial<Pokemon>[]> {
    const db = await indexedDb
    const tx = db.transaction(DB_TABLES.pokemons, 'readonly')
    const store = tx.objectStore(DB_TABLES.pokemons)

    const pokemonTypeRepository = new PokemonTypeDBRepository()

    const results = await store.getAll()

    return await Promise.all(
      results.map(async (item) => {
        const types: PokemonType[] = []

        types.push(
          await pokemonTypeRepository.getById(
            PokemonTypeId.create(item.first_type_id)
          )
        )

        if (item.second_type_id) {
          types.push(
            await pokemonTypeRepository.getById(
              PokemonTypeId.create(item.second_type_id)
            )
          )
        }

        return new Pokemon(
          PokemonId.create(item.id),
          item.name,
          item.height,
          item.weight,
          item.base_experience,
          item.cry,
          {
            front: item.sprite_front,
            back: item.sprite_back,
            back_shiny: item.sprite_back_shiny,
            front_shiny: item.sprite_front_shiny,
          },
          [],
          types,
          {
            hp: item.base_hp,
            attack: item.base_attack,
            defense: item.base_defense,
            special_attack: item.base_special_attack,
            special_defense: item.base_special_defense,
            speed: item.base_speed,
          }
        )
      })
    )
  }

  async save(pokemon: Pokemon): Promise<Pokemon> {
    const db = await indexedDb
    const pokemonDb = await PokemonMapper.toDB(pokemon)
    const tx = db.transaction(DB_TABLES.pokemons, 'readwrite')

    await tx.store.put(pokemonDb)

    await tx.done

    await Promise.all(
      (pokemon.moves ?? []).map(async (move) => {
        const tx = db.transaction(DB_TABLES.pokemon_moves, 'readwrite')

        await tx.store.put(PokemonMapper.toMoveDB(pokemon, move))

        await tx.done
      })
    )

    return pokemon
  }
}
