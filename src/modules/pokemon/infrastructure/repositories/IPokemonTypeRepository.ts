import type { PokemonType } from '../../domain/entities/PokemonType'
import type { PokemonTypeId } from '../../domain/values-objetcts/PokemonTypeId'

export interface IPokemonTypeRepository {
  getById(id: PokemonTypeId): Promise<PokemonType>
  getByName(name: string): Promise<PokemonType>
  listAll(): Promise<Partial<PokemonType>[]>
  save(pokemonType: PokemonType): Promise<PokemonType>
}
