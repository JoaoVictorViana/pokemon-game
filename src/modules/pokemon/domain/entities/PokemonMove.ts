import type { PokemonType } from '../../enums'

export class PokemonMove {
  constructor(
    public readonly name: string,
    public readonly type: PokemonType,
    public readonly power: number | null,
    public readonly pp: number | null,
    public readonly accuracy: number | null
  ) {}
}
