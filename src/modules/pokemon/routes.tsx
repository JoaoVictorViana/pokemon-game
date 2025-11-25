import type { RouteObject } from 'react-router'
import { PokemonListPage } from './ui/pages/PokemonListPage'
import { PokemonDetails } from './ui/components/PokemonDetails'

export const pokemonRoutes: RouteObject[] = [
  { path: '/pokemon-list', element: <PokemonListPage /> },
  { path: '/pokemon-details/:pokemonId', element: <PokemonDetails /> },
]
