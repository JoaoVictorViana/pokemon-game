import { PokemonMove } from '../../domain/entities/PokemonMove'
import { DB_TABLES, indexedDb } from '@/configs/db'
import type { IMoveRepository } from './IMoveRepository'
import { PokemonMoveId } from '../../domain/value-objects/PokemonMoveId'
import { PokemonMoveMapper } from '../mappers/MoveMapper'
import { PokemonTypeDBRepository } from './PokemonTypeDBRepository'
import { PokemonTypeId } from '../../domain/value-objects/PokemonTypeId'
import type { PokemonType } from '../../enums'

export class MoveDBRepository implements IMoveRepository {
  async getById(id: PokemonMoveId): Promise<PokemonMove> {
    const db = await indexedDb
    const tx = db.transaction(DB_TABLES.moves, 'readonly')
    const store = tx.objectStore(DB_TABLES.moves)

    const typeRepository = new PokemonTypeDBRepository()

    const result = await store.get(id.getValue())

    return new PokemonMove(
      PokemonMoveId.create(result.id),
      result.name,
      (await typeRepository.getById(PokemonTypeId.create(result.type_id)))
        ?.name as PokemonType,
      result.power,
      result.pp,
      result.accuracy
    )
  }

  async getByName(name: string): Promise<PokemonMove> {
    const db = await indexedDb
    const tx = db.transaction(DB_TABLES.moves, 'readonly')
    const store = tx.objectStore(DB_TABLES.moves)

    const index = store.index('name')
    const result = await index.get(name)
    const typeRepository = new PokemonTypeDBRepository()

    return new PokemonMove(
      PokemonMoveId.create(result.id),
      result.name,
      (await typeRepository.getById(PokemonTypeId.create(result.type_id)))
        ?.name as PokemonType,
      result.power,
      result.pp,
      result.accuracy
    )
  }

  async listAll(): Promise<Partial<PokemonMove>[]> {
    const db = await indexedDb
    const tx = db.transaction(DB_TABLES.moves, 'readonly')
    const store = tx.objectStore(DB_TABLES.moves)
    const typeRepository = new PokemonTypeDBRepository()

    const results = await store.getAll()

    return await Promise.all(
      results.map(
        async (item) =>
          new PokemonMove(
            PokemonMoveId.create(item.id),
            item.name,
            (await typeRepository.getById(PokemonTypeId.create(item.type_id)))
              ?.name as PokemonType,
            item.power,
            item.pp,
            item.accuracy
          )
      )
    )
  }

  async save(move: PokemonMove): Promise<PokemonMove> {
    const db = await indexedDb
    const typeRepository = new PokemonTypeDBRepository()
    const type = await typeRepository.getByName(move.type)
    const moveDb = PokemonMoveMapper.toDB(move, type.id.getValue())

    const tx = db.transaction(DB_TABLES.moves, 'readwrite')

    await tx.store.put(moveDb)

    await tx.done

    return move
  }
}

