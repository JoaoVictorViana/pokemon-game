import { type RouteObject } from 'react-router'
import { BootPage } from './ui/pages/BootPage'

export const bootRoutes: RouteObject[] = [
  {
    path: '/',
    element: <BootPage />,
  },
]
