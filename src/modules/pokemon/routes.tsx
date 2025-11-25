import type { RouteObject } from 'react-router'
import { PokemonDetails } from '../pokedex/ui/components/PokemonDetails/PokemonDetails'

export const pokemonRoutes: RouteObject[] = [
  { path: '/pokemon-details/:pokemonId', element: <PokemonDetails /> },
]
