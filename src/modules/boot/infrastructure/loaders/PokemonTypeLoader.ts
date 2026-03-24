import {
  BootLoaderService,
  type BootLoader,
  type BootLoaderContext,
} from '../../domain/services/BootLoaderService'
import { typeClient } from '@/modules/pokemon/infrastructure/http/typeClient'
import { PokemonTypeDBRepository } from '@/modules/pokemon/infrastructure/repositories/PokemonTypeDBRepository'
import { PokemonTypeMapper } from '@/modules/pokemon/infrastructure/mappers/PokemonTypeMapper'
import { runWithConcurrency } from '@/shared/utils/promise'

export class PokemonTypeLoader implements BootLoader {
  readonly name = 'pokemon_types'

  constructor(private repository: PokemonTypeDBRepository) {}

  async execute({ update }: BootLoaderContext) {
    update({ progress: 0, message: 'Carregando tipos...' })
    const executed = await BootLoaderService.hasLoaderExecuted('pokemon_types')

    if (executed) {
      update({ progress: 1, message: 'Tipos carregados!' })
      return
    }

    const pokemonTypes = await typeClient.listAll()

    await runWithConcurrency(
      pokemonTypes.results.map((pokemonType) => async () => {
        const data = await typeClient.fetchByUrl(pokemonType.url)
        await this.repository.save(await PokemonTypeMapper.fromApi(data))
      }),
      5
    )

    await BootLoaderService.markLoaderExecuted('pokemon_types')

    update({ progress: 1, message: 'Tipos carregados!' })
  }
}
