import type { RouteObject } from 'react-router'
import { StarterSelectionPage } from './ui/pages/StarterSelectionPage'

export const pokemonRoutes: RouteObject[] = [
  {
    path: '/starter-selection',
    element: <StarterSelectionPage />,
  },
]
