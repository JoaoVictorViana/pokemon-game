import { DB_TABLES, indexedDb } from '@/configs/db'

export interface BootStepStatus {
  progress: number
  message: string
}

export interface BootLoaderContext {
  update: (status: BootStepStatus) => void
}

export interface BootLoader {
  readonly name: string
  execute(context: BootLoaderContext): Promise<void>
}

export class BootLoaderService {
  constructor(private loaders: BootLoader[]) {}

  async runAll(progressCallback: (progress: number, msg: string) => void) {
    const total = this.loaders.length

    for (let i = 0; i < total; i++) {
      const loader = this.loaders[i]
      await loader.execute({
        update: ({ progress, message }) => {
          const currentProgress = ((i + progress) / total) * 100
          progressCallback(currentProgress, message)
        },
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
