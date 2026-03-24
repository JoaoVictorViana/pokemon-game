import type { IPlayerProgressRepository } from '../../infrastructure/repositories/IPlayerProgressRepository'

export class CheckStarterPokemonSelectionUseCase {
  constructor(private readonly repository: IPlayerProgressRepository) {}

  async execute() {
    return this.repository.hasStarterPokemonSelected()
  }
}
