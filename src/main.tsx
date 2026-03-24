import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { GameLayout } from './shared/ui/GameLayout/index.tsx'
import { AudioProvider } from './shared/ui/AudioProvider/index.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AudioProvider>
      <GameLayout>
        <App />
      </GameLayout>
    </AudioProvider>
  </BrowserRouter>
)
