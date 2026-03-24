import { CheckStarterPokemonSelectionUseCase } from '../../application/use-cases/CheckStarterPokemonSelectionUseCase'
import { ConfirmStarterPokemonUseCase } from '../../application/use-cases/ConfirmStarterPokemonUseCase'
import { FetchPokemonUseCase } from '../../application/use-cases/FetchPokemonUseCase'
import { GetStarterPokemonsUseCase } from '../../application/use-cases/GetStarterPokemonsUseCase'
import { ListPokemonsUseCase } from '../../application/use-cases/ListPokemonsUseCase'
import { MoveDBRepository } from '../repositories/MoveDBRepository'
import { PlayerProgressDBRepository } from '../repositories/PlayerProgressDBRepository'
import { PokemonDBRepository } from '../repositories/PokemonDBRepository'
import { PokemonTypeDBRepository } from '../repositories/PokemonTypeDBRepository'
import { UserPokemonDBRepository } from '../repositories/UserPokemonDBRepository'

export function createPokemonModule() {
  const pokemonRepository = new PokemonDBRepository()
  const moveRepository = new MoveDBRepository()
  const pokemonTypeRepository = new PokemonTypeDBRepository()
  const userPokemonRepository = new UserPokemonDBRepository()
  const playerProgressRepository = new PlayerProgressDBRepository()

  return {
    repositories: {
      moveRepository,
      playerProgressRepository,
      pokemonRepository,
      pokemonTypeRepository,
      userPokemonRepository,
    },
    useCases: {
      checkStarterPokemonSelection: new CheckStarterPokemonSelectionUseCase(
        playerProgressRepository
      ),
      confirmStarterPokemon: new ConfirmStarterPokemonUseCase(
        pokemonRepository,
        userPokemonRepository,
        playerProgressRepository
      ),
      fetchPokemon: new FetchPokemonUseCase(pokemonRepository),
      getStarterPokemons: new GetStarterPokemonsUseCase(pokemonRepository),
      listPokemons: new ListPokemonsUseCase(pokemonRepository),
    },
  }
}
