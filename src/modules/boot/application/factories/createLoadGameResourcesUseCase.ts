import { createPokemonModule } from '@/modules/pokemon/infrastructure/composition/createPokemonModule'
import { LoadGameResourcesUseCase } from '../use-cases/LoadGameResourcesUseCase'
import { BootLoaderService } from '../../domain/services/BootLoaderService'
import { MoveLoader } from '../../infrastructure/loaders/MoveLoader'
import { PokemonDataLoader } from '../../infrastructure/loaders/PokemonDataLoader'
import { PokemonTypeLoader } from '../../infrastructure/loaders/PokemonTypeLoader'

export function createLoadGameResourcesUseCase() {
  const pokemonModule = createPokemonModule()

  const service = new BootLoaderService([
    new PokemonTypeLoader(pokemonModule.repositories.pokemonTypeRepository),
    new MoveLoader(pokemonModule.repositories.moveRepository),
    new PokemonDataLoader(),
  ])

  return new LoadGameResourcesUseCase(service)
}
