import { useRoutes } from 'react-router'
import { exampleRoutes } from '@/modules/example/routes'

function App() {
  const routes = useRoutes([
    ...exampleRoutes,
    { path: '*', element: <h1>Página não encontrada</h1> },
  ])

  return routes
}

export default App
