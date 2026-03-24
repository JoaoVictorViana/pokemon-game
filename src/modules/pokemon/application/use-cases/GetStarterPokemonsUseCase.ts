import { PokemonId } from '../../domain/value-objects/PokemonId'
import type { IPokemonRepository } from '../../infrastructure/repositories/IPokemonRepository'

const STARTER_POKEMON_IDS = [1, 4, 7] as const

export class GetStarterPokemonsUseCase {
  constructor(private readonly repository: IPokemonRepository) {}

  async execute() {
    return Promise.all(
      STARTER_POKEMON_IDS.map((id) =>
        this.repository.getById(PokemonId.create(id))
      )
    )
  }
}
