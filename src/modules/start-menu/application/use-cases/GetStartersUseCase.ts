import type { PokemonService } from '@/modules/pokemon/domain/services/PokemonService'

export class GetStartersUseCase {
  constructor(private service: PokemonService) {}

  async execute(startersIds: number[]) {
    return await Promise.all(startersIds.map((id) => this.service.fetch(id)))
  }
}
