import { PokemonType } from '../../domain/entities/PokemonType'
import { DB_TABLES, indexedDb } from '@/configs/db'
import type { IPokemonTypeRepository } from './IPokemonTypeRepository'
import { PokemonTypeId } from '../../domain/values-objetcts/PokemonTypeId'
import { PokemonTypeMapper } from '../mappers/PokemonTypeMapper'

export class PokemonTypeDBRepository implements IPokemonTypeRepository {
  async getById(id: PokemonTypeId): Promise<PokemonType> {
    const db = await indexedDb
    const tx = db.transaction(DB_TABLES.types, 'readonly')
    const store = tx.objectStore(DB_TABLES.types)

    const result = await store.get(id.getValue())

    return new PokemonType(
      PokemonTypeId.create(result.id),
      result.name,
      result.sprite,
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    )
  }

  async getByName(name: string): Promise<PokemonType> {
    const db = await indexedDb
    const tx = db.transaction(DB_TABLES.types, 'readonly')
    const store = tx.objectStore(DB_TABLES.types)

    const index = store.index('name')
    const result = await index.get(name)

    return new PokemonType(
      PokemonTypeId.create(result.id),
      result.name,
      result.sprite,
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    )
  }

  async listAll(): Promise<Partial<PokemonType>[]> {
    const db = await indexedDb
    const tx = db.transaction(DB_TABLES.types, 'readonly')
    const store = tx.objectStore(DB_TABLES.types)

    const results = await store.getAll()

    return results.map(
      (item) =>
        new PokemonType(
          PokemonTypeId.create(item.id),
          item.name,
          item.sprite,
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          []
        )
    )
  }

  async save(pokemonType: PokemonType): Promise<PokemonType> {
    const db = await indexedDb
    const tx = db.transaction(DB_TABLES.types, 'readwrite')
    await tx.store.put(PokemonTypeMapper.toDB(pokemonType))

    await tx.done

    await Promise.all(
      pokemonType.double_damage_to.map(async (type) => {
        const tx = db.transaction(DB_TABLES.type_effectiveness, 'readwrite')

        await tx.store.put(
          PokemonTypeMapper.toEffectivenessDB(pokemonType, type, 'DOUBLE')
        )

        await tx.done
      })
    )

    await Promise.all(
      pokemonType.double_damage_from.map(async (type) => {
        const tx = db.transaction(DB_TABLES.type_effectiveness, 'readwrite')

        await tx.store.put(
          PokemonTypeMapper.toEffectivenessDB(type, pokemonType, 'DOUBLE')
        )

        await tx.done
      })
    )

    await Promise.all(
      pokemonType.half_damage_to.map(async (type) => {
        const tx = db.transaction(DB_TABLES.type_effectiveness, 'readwrite')

        await tx.store.put(
          PokemonTypeMapper.toEffectivenessDB(pokemonType, type, 'HALF')
        )

        await tx.done
      })
    )

    await Promise.all(
      pokemonType.half_damage_from.map(async (type) => {
        const tx = db.transaction(DB_TABLES.type_effectiveness, 'readwrite')

        await tx.store.put(
          PokemonTypeMapper.toEffectivenessDB(type, pokemonType, 'HALF')
        )

        await tx.done
      })
    )

    await Promise.all(
      pokemonType.no_damage_to.map(async (type) => {
        const tx = db.transaction(DB_TABLES.type_effectiveness, 'readwrite')

        await tx.store.put(
          PokemonTypeMapper.toEffectivenessDB(pokemonType, type, 'NO_DAMAGE')
        )

        await tx.done
      })
    )

    await Promise.all(
      pokemonType.no_damage_from.map(async (type) => {
        const tx = db.transaction(DB_TABLES.type_effectiveness, 'readwrite')

        await tx.store.put(
          PokemonTypeMapper.toEffectivenessDB(type, pokemonType, 'NO_DAMAGE')
        )

        await tx.done
      })
    )

    return pokemonType
  }
}
