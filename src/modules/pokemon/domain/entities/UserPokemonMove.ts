export class UserPokemonMove {
  constructor(
    public readonly move_id: number,
    public readonly slot: number,
    public readonly level_learned_at: number,
    public readonly id?: number,
    public readonly user_pokemon_id?: number
  ) {}
}
