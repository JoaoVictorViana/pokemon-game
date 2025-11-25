import { PokemonId } from '../values-objetcts/PokemonId'
import type { Move } from './Move'
import type { PokemonSprites } from './PokemonSprites'

export class Pokemon {
  constructor(
    public readonly id: PokemonId,
    public readonly name: string,
    public readonly height: number,
    public readonly weight: number,
    public readonly base_experience: number,
    public readonly cry: string,
    public readonly sprites: PokemonSprites,
    public readonly moves: Move[]
  ) {}
}
