import { DB_TABLES, indexedDb } from '@/configs/db'

export type ProgressCallback = (progress: number, msg: string) => void

export interface BootLoader {
  load(progressCallback: ProgressCallback): Promise<void>
}

export class BootLoaderService {
  constructor(private loaders: BootLoader[]) {}

  async runAll(progressCallback: ProgressCallback) {
    const total = this.loaders.length

    for (let i = 0; i < total; i++) {
      const loader = this.loaders[i]
      await loader.load((step, msg) => {
        const progress = ((i + step) / total) * 100
        progressCallback(progress, msg)
      })
    }
  }

  static async markLoaderExecuted(loaderName: string) {
    const db = await indexedDb
    const tx = db.transaction(DB_TABLES.app_metadata, 'readwrite')
    const store = tx.objectStore(DB_TABLES.app_metadata)

    await store.put({
      key: `loader.${loaderName}`,
      value: true,
      updatedAt: Date.now(),
    })

    await tx.done
  }

  static async hasLoaderExecuted(loaderName: string): Promise<boolean> {
    const db = await indexedDb
    const tx = db.transaction(DB_TABLES.app_metadata, 'readonly')
    const store = tx.objectStore(DB_TABLES.app_metadata)

    const result = await store.get(`loader.${loaderName}`)
    return result?.value === true
  }
}
