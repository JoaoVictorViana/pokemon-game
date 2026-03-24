import { createPokemonModule } from '../infrastructure/composition/createPokemonModule'

export function createStarterSelectionDependencies() {
  const pokemonModule = createPokemonModule()

  return {
    checkStarterPokemonSelection:
      pokemonModule.useCases.checkStarterPokemonSelection,
    confirmStarterPokemon: pokemonModule.useCases.confirmStarterPokemon,
    getStarterPokemons: pokemonModule.useCases.getStarterPokemons,
  }
}
