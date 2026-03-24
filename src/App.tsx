import { useRoutes } from 'react-router'
import { bootRoutes } from './modules/boot/routes'
import { pokedexRoutes } from './modules/pokedex/routes'
import { pokemonRoutes } from './modules/pokemon/routes'
import { startMenuRoutes } from './modules/start-menu/routes'

function App() {
  const routes = useRoutes([
    ...bootRoutes,
    ...startMenuRoutes,
    ...pokemonRoutes,
    ...pokedexRoutes,
    { path: '*', element: <h1>Página não encontrada</h1> },
  ])

  return routes
}

export default App
