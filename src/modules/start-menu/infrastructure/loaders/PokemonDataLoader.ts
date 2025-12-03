import { pokemonClient } from '@/modules/pokemon/infrastructure/http/pokemonClient'
import {
  BootLoaderService,
  type BootLoader,
  type ProgressCallback,
} from '../../domain/services/BootLoaderService'
import PokemonWorker from '@/shared/utils/workers/bootWorker?worker'

export class PokemonDataLoader implements BootLoader {
  async load(update: ProgressCallback) {
    update(0, 'Carregando dados dos pokemons...')
    const executed = await BootLoaderService.hasLoaderExecuted('pokemons')

    if (executed) {
      update(1, 'Dados carregados!')
      return
    }
    const pokemons = await pokemonClient.listAll()

    const worker = new PokemonWorker()

    worker.postMessage({ pokemons: pokemons.results })

    worker.onmessage = () => {
      BootLoaderService.markLoaderExecuted('pokemons').then(() =>
        update(1, 'Dados carregados!')
      )
    }
  }
}
