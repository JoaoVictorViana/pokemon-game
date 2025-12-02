import type { PokemonType } from '../../enums'
import type { PokemonMoveId } from '../values-objetcts/PokemonMoveId'

export class PokemonMove {
  constructor(
    public readonly id: PokemonMoveId,
    public readonly name: string,
    public readonly type: PokemonType,
    public readonly power: number,
    public readonly pp: number,
    public readonly accuracy: number,
    public readonly level_learned_at?: number
  ) {}
}
