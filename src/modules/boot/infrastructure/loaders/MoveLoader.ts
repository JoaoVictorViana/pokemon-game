import { MoveDBRepository } from '@/modules/pokemon/infrastructure/repositories/MoveDBRepository'
import {
  BootLoaderService,
  type BootLoader,
  type BootLoaderContext,
} from '../../domain/services/BootLoaderService'
import { moveClient } from '@/modules/pokemon/infrastructure/http/moveClient'
import { PokemonMoveMapper } from '@/modules/pokemon/infrastructure/mappers/MoveMapper'
import { runWithConcurrency } from '@/shared/utils/promise'

export class MoveLoader implements BootLoader {
  readonly name = 'moves'

  constructor(private repository: MoveDBRepository) {}

  async execute({ update }: BootLoaderContext) {
    update({ progress: 0, message: 'Carregando movimentos...' })
    const executed = await BootLoaderService.hasLoaderExecuted('moves')

    if (executed) {
      update({ progress: 1, message: 'Movimentos carregados!' })
      return
    }

    const moves = await moveClient.listAll()

    await runWithConcurrency(
      moves.results.map((move) => async () => {
        const data = await moveClient.fetchByUrl(move.url)
        await this.repository.save(PokemonMoveMapper.fromApi(data))
      }),
      10
    )

    await BootLoaderService.markLoaderExecuted('moves')

    update({ progress: 1, message: 'Movimentos carregados!' })
  }
}
