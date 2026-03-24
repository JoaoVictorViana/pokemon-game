export class PokemonId {
  private constructor(private readonly value: number) {}

  static create(id: number): PokemonId {
    if (id <= 0) throw new Error('Invalid Pokémon ID')
    return new PokemonId(id)
  }

  getValue() {
    return this.value
  }
}
