import { MoveDBRepository } from '@/modules/pokemon/infrastructure/repositories/MoveDBRepository'
import {
  BootLoaderService,
  type BootLoader,
  type ProgressCallback,
} from '../../domain/services/BootLoaderService'
import { moveClient } from '@/modules/pokemon/infrastructure/http/moveClient'
import { PokemonMoveMapper } from '@/modules/pokemon/infrastructure/mappers/MoveMapper'

export class MoveLoader implements BootLoader {
  async load(update: ProgressCallback) {
    update(0, 'Carregando movimentos...')
    const executed = await BootLoaderService.hasLoaderExecuted('moves')

    if (executed) {
      update(1, 'Movimentos carregados!')
      return
    }
    const moves = await moveClient.listAll()
    const repository = new MoveDBRepository()

    await Promise.all(
      moves.results.map(async (move: { url: string }) => {
        const data = await moveClient.fetchByUrl(move.url)
        await repository.save(PokemonMoveMapper.fromApi(data))
      })
    )

    await BootLoaderService.markLoaderExecuted('moves')

    update(1, 'Movimentos carregados!')
  }
}
