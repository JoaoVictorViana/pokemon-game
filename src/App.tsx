import { useRoutes } from 'react-router'
import { pokemonRoutes } from './modules/pokemon/routes'
import { pokedexRoutes } from './modules/pokedex/routes'
import { bootRoutes } from './modules/boot/routes'

function App() {
  const routes = useRoutes([
    ...bootRoutes,
    ...pokemonRoutes,
    ...pokedexRoutes,
    { path: '*', element: <h1>Página não encontrada</h1> },
  ])

  return routes
}

export default App
