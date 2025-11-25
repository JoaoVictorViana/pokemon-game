import type { Pokemon } from './Pokemon'
import type { PokemonMove } from './PokemonMove'

export class PokemonType {
  constructor(
    public readonly name: string,
    public readonly sprite: string,
    public readonly double_damage_from: PokemonType[],
    public readonly double_damage_to: PokemonType[],
    public readonly half_damage_from: PokemonType[],
    public readonly half_damage_to: PokemonType[],
    public readonly no_damage_from: PokemonType[],
    public readonly no_damage_to: PokemonType[],
    public readonly moves: PokemonMove[],
    public readonly pokemons: Pokemon[]
  ) {}
}
