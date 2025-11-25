import type { IPokemonRepository } from '../../infrastructure/repositories/IPokemonRepository'

export class ListPokemonsUseCase {
  constructor(private repo: IPokemonRepository) {}

  async execute() {
    return this.repo.listAll()
  }
}
