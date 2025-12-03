import {
  BootLoaderService,
  type BootLoader,
  type ProgressCallback,
} from '../../domain/services/BootLoaderService'
import { typeClient } from '@/modules/pokemon/infrastructure/http/typeClient'
import { PokemonTypeDBRepository } from '@/modules/pokemon/infrastructure/repositories/PokemonTypeDBRepository'
import { PokemonTypeMapper } from '@/modules/pokemon/infrastructure/mappers/PokemonTypeMapper'

export class PokemonTypeLoader implements BootLoader {
  async load(update: ProgressCallback) {
    update(0, 'Carregando tipos...')
    const executed = await BootLoaderService.hasLoaderExecuted('pokemon_types')

    if (executed) {
      update(1, 'Tipos carregados!')
      return
    }

    const pokemonTypes = await typeClient.listAll()
    const repository = new PokemonTypeDBRepository()

    await Promise.all(
      pokemonTypes.results.map(async (pokemonType: { url: string }) => {
        const data = await typeClient.fetchByUrl(pokemonType.url)
        await repository.save(await PokemonTypeMapper.fromApi(data))
      })
    )

    await BootLoaderService.markLoaderExecuted('pokemon_types')

    update(1, 'Tipos carregados!')
  }
}
