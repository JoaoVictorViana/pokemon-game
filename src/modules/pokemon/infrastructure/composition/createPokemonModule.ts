import { FetchPokemonUseCase } from '../../application/use-cases/FetchPokemonUseCase'
import { ListPokemonsUseCase } from '../../application/use-cases/ListPokemonsUseCase'
import { MoveDBRepository } from '../repositories/MoveDBRepository'
import { PokemonDBRepository } from '../repositories/PokemonDBRepository'
import { PokemonTypeDBRepository } from '../repositories/PokemonTypeDBRepository'

export function createPokemonModule() {
  const pokemonRepository = new PokemonDBRepository()
  const moveRepository = new MoveDBRepository()
  const pokemonTypeRepository = new PokemonTypeDBRepository()

  return {
    repositories: {
      moveRepository,
      pokemonRepository,
      pokemonTypeRepository,
    },
    useCases: {
      fetchPokemon: new FetchPokemonUseCase(pokemonRepository),
      listPokemons: new ListPokemonsUseCase(pokemonRepository),
    },
  }
}
