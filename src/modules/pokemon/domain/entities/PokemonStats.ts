export class PokemonStats {
  constructor(
    public readonly hp: number,
    public readonly attack: number,
    public readonly defense: number,
    public readonly special_attack: number,
    public readonly special_defense: number,
    public readonly speed: number
  ) {}
}
