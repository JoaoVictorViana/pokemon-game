import { type RouteObject } from 'react-router'
import { StartMenuPage } from './ui/pages/StartMenuPage'
import CreditsPage from './ui/pages/CreditsPage'

export const startMenuRoutes: RouteObject[] = [
  {
    path: '/menu',
    element: <StartMenuPage />,
  },
  {
    path: '/credits',
    element: <CreditsPage />,
  },
]
