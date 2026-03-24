import type { PokemonMove } from '../../domain/entities/PokemonMove'
import type { PokemonMoveId } from '../../domain/value-objects/PokemonMoveId'

export interface IMoveRepository {
  getById(id: PokemonMoveId): Promise<PokemonMove>
  getByName(name: string): Promise<PokemonMove>
  listAll(): Promise<Partial<PokemonMove>[]>
  save(move: PokemonMove): Promise<PokemonMove>
}

