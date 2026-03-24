import { pokemonClient } from '@/modules/pokemon/infrastructure/http/pokemonClient'
import {
  BootLoaderService,
  type BootLoader,
  type BootLoaderContext,
} from '../../domain/services/BootLoaderService'
import PokemonWorker from '@/shared/utils/workers/bootWorker?worker'

export class PokemonDataLoader implements BootLoader {
  readonly name = 'pokemons'

  async execute({ update }: BootLoaderContext) {
    update({ progress: 0, message: 'Carregando dados dos pokemons...' })
    const executed = await BootLoaderService.hasLoaderExecuted('pokemons')

    if (executed) {
      update({ progress: 1, message: 'Dados carregados!' })
      return
    }

    const pokemons = await pokemonClient.listAll()
    const worker = new PokemonWorker()

    await new Promise<void>((resolve, reject) => {
      worker.postMessage({ pokemons: pokemons.results })

      worker.onmessage = async () => {
        await BootLoaderService.markLoaderExecuted('pokemons')
        update({ progress: 1, message: 'Dados carregados!' })
        worker.terminate()
        resolve()
      }

      worker.onerror = (event) => {
        worker.terminate()
        reject(event.error ?? new Error('Pokemon worker failed'))
      }
    })
  }
}
