export class PokemonTypeId {
  private constructor(private readonly value: number) {}

  static create(id: number): PokemonTypeId {
    if (id <= 0) throw new Error('Invalid Pokemon Type ID')
    return new PokemonTypeId(id)
  }

  getValue() {
    return this.value
  }
}
