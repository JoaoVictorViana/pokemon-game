import type { IPokemonRepository } from '../../infrastructure/repositories/IPokemonRepository'
import { PokemonId } from '../values-objetcts/PokemonId'

export class PokemonService {
  constructor(private repo: IPokemonRepository) {}

  async fetch(id: number) {
    return this.repo.getById(PokemonId.create(id))
  }
}
