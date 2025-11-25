import { PokemonId } from '../values-objetcts/PokemonId'
import type { PokemonMove } from './PokemonMove'
import type { PokemonSprites } from './PokemonSprites'
import type { PokemonStats } from './PokemonStats'
import type { PokemonType } from './PokemonType'

export class Pokemon {
  constructor(
    public readonly id: PokemonId,
    public readonly name: string,
    public readonly height: number,
    public readonly weight: number,
    public readonly base_experience: number,
    public readonly cry: string,
    public readonly sprites?: PokemonSprites,
    public readonly moves?: PokemonMove[],
    public readonly types?: PokemonType[],
    public readonly stats?: PokemonStats
  ) {}
}
