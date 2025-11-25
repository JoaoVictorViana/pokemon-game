export class Move {
  constructor(
    public readonly name: string,
    public readonly type: string,
    public readonly power: number | null,
    public readonly accuracy: number | null
  ) {}
}
