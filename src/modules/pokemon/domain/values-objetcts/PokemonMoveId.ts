export class PokemonMoveId {
  private constructor(private readonly value: number) {}

  static create(id: number): PokemonMoveId {
    if (id <= 0) throw new Error('Invalid Move ID')
    return new PokemonMoveId(id)
  }

  getValue() {
    return this.value
  }
}
