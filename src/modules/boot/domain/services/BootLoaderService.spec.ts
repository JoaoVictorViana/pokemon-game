import { describe, expect, it, vi } from 'vitest'

vi.mock('@/configs/db', () => ({
  DB_TABLES: {
    app_metadata: 'app_metadata',
  },
  indexedDb: Promise.resolve({
    transaction: vi.fn(),
  }),
}))

import { BootLoaderService, type BootLoader } from './BootLoaderService'

describe('BootLoaderService', () => {
  it('aguarda todos os loaders terminarem antes de concluir', async () => {
    const events: string[] = []

    const delayedLoader: BootLoader = {
      name: 'delayed',
      execute: async ({ update }) => {
        await new Promise((resolve) => setTimeout(resolve, 5))
        events.push('delayed-finished')
        update({ progress: 1, message: 'Delayed done' })
      },
    }

    const fastLoader: BootLoader = {
      name: 'fast',
      execute: async ({ update }) => {
        events.push('fast-finished')
        update({ progress: 1, message: 'Fast done' })
      },
    }

    const service = new BootLoaderService([delayedLoader, fastLoader])
    const onProgress = vi.fn()

    await service.runAll(onProgress)

    expect(events).toEqual(['delayed-finished', 'fast-finished'])
    expect(onProgress).toHaveBeenLastCalledWith(100, 'Fast done')
  })
})
