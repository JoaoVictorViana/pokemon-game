import type { Pokemon } from '../../domain/entities/Pokemon'
import type { PokemonId } from '../../domain/values-objetcts/PokemonId'

export interface IPokemonRepository {
  getById(id: PokemonId): Promise<Pokemon>
  listAll(): Promise<Partial<Pokemon>[]>
}
