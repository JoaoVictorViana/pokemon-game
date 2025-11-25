import type { RouteObject } from 'react-router'
import { PokedexPage } from './ui/pages/PokedexPage'

export const pokedexRoutes: RouteObject[] = [
  { path: '/pokedex', element: <PokedexPage /> },
]
