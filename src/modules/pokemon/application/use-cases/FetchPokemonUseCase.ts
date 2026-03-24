import { PokemonId } from '../../domain/value-objects/PokemonId'
import type { IPokemonRepository } from '../../infrastructure/repositories/IPokemonRepository'

export class FetchPokemonUseCase {
  constructor(private repo: IPokemonRepository) {}

  async execute(id: number) {
    return this.repo.getById(PokemonId.create(id))
  }
}

