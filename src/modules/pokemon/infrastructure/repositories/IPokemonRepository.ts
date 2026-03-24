import type { Pokemon } from '../../domain/entities/Pokemon'
import type { PokemonId } from '../../domain/value-objects/PokemonId'

export interface IPokemonRepository {
  getById(id: PokemonId): Promise<Pokemon>
  listAll(): Promise<Partial<Pokemon>[]>
  save(pokemon: Pokemon): Promise<Pokemon>
}

