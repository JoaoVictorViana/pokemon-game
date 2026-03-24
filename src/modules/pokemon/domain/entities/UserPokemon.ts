export class UserPokemon {
  constructor(
    public readonly pokemon_id: number,
    public readonly name: string,
    public readonly level: number,
    public readonly experience: number,
    public readonly is_shiny: boolean,
    public readonly cry?: ArrayBuffer,
    public readonly sprite_front?: ArrayBuffer,
    public readonly sprite_back?: ArrayBuffer,
    public readonly sprite_front_shiny?: ArrayBuffer,
    public readonly sprite_back_shiny?: ArrayBuffer,
    public readonly base_hp: number = 0,
    public readonly base_attack: number = 0,
    public readonly base_defense: number = 0,
    public readonly base_special_attack: number = 0,
    public readonly base_special_defense: number = 0,
    public readonly base_speed: number = 0,
    public readonly id?: number
  ) {}
}
