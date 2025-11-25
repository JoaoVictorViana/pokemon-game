import { useRoutes } from 'react-router'
import { exampleRoutes } from '@/modules/example/routes'
import { pokemonRoutes } from './modules/pokemon/routes'

function App() {
  const routes = useRoutes([
    ...exampleRoutes,
    ...pokemonRoutes,
    { path: '*', element: <h1>Página não encontrada</h1> },
  ])

  return routes
}

export default App
