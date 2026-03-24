import { DB_TABLES, indexedDb } from '@/configs/db'
import type { IPlayerProgressRepository } from './IPlayerProgressRepository'

const STARTER_SELECTED_KEY = 'player.starter.selected'

export class PlayerProgressDBRepository implements IPlayerProgressRepository {
  async hasStarterPokemonSelected(): Promise<boolean> {
    const db = await indexedDb
    const tx = db.transaction(DB_TABLES.app_metadata, 'readonly')
    const store = tx.objectStore(DB_TABLES.app_metadata)
    const result = await store.get(STARTER_SELECTED_KEY)

    return result?.value === true
  }

  async markStarterPokemonSelected(): Promise<void> {
    const db = await indexedDb
    const tx = db.transaction(DB_TABLES.app_metadata, 'readwrite')
    const store = tx.objectStore(DB_TABLES.app_metadata)

    await store.put({
      key: STARTER_SELECTED_KEY,
      value: true,
      updatedAt: Date.now(),
    })

    await tx.done
  }
}
