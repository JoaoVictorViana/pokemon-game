import { createPokemonModule } from '@/modules/pokemon/infrastructure/composition/createPokemonModule'

export function createPokedexDependencies() {
  const pokemonModule = createPokemonModule()

  return {
    fetchPokemon: pokemonModule.useCases.fetchPokemon,
    listPokemons: pokemonModule.useCases.listPokemons,
  }
}
