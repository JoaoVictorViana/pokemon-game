import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { GameLayout } from './shared/ui/GameLayout/index.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <GameLayout>
      <App />
    </GameLayout>
  </BrowserRouter>
)
