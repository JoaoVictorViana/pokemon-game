import { type RouteObject } from 'react-router'
import { StartMenuPage } from './ui/pages/StartMenuPage'
import CreditsPage from './ui/pages/CreditsPage'
import { ChooseStarterPage } from './ui/pages/ChooseStarterPage'

export const startMenuRoutes: RouteObject[] = [
  {
    path: '/choose-starter',
    element: <ChooseStarterPage />,
  },
  {
    path: '/menu',
    element: <StartMenuPage />,
  },
  {
    path: '/credits',
    element: <CreditsPage />,
  },
]
