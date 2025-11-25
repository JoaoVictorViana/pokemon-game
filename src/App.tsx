import { useRoutes } from 'react-router'
import { exampleRoutes } from '@/modules/example/routes'
import { pokemonRoutes } from './modules/pokemon/routes'
import { pokedexRoutes } from './modules/pokedex/routes'

function App() {
  const routes = useRoutes([
    ...exampleRoutes,
    ...pokemonRoutes,
    ...pokedexRoutes,
    { path: '*', element: <h1>Página não encontrada</h1> },
  ])

  return routes
}

export default App
