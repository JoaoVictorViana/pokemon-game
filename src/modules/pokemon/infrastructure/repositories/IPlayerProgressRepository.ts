export interface IPlayerProgressRepository {
  hasStarterPokemonSelected(): Promise<boolean>
  markStarterPokemonSelected(): Promise<void>
}
