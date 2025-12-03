import { useEffect, useState } from 'react'
import { LoadingBar } from '../components/LoadingBar'
import { BootLoaderService } from '../../domain/services/BootLoaderService'
import { LoadGameResourcesUseCase } from '../../application/use-cases/LoadGameResourcesUseCase'
import { useNavigate } from 'react-router'
import { PokemonTypeLoader } from '../../infrastructure/loaders/PokemonTypeLoader'
import { MoveLoader } from '../../infrastructure/loaders/MoveLoader'
import { PokemonDataLoader } from '../../infrastructure/loaders/PokemonDataLoader'

export function BootPage() {
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const service = new BootLoaderService([
      new PokemonTypeLoader(),
      new MoveLoader(),
      new PokemonDataLoader(),
    ])

    const usecase = new LoadGameResourcesUseCase(service)

    usecase.execute((p, m) => {
      setProgress(p)
      setMessage(m)

      if (p >= 100) {
        setTimeout(() => navigate('/menu'), 500)
      }
    })
  }, [navigate])

  return (
    <main className="w-full h-full flex flex-col items-center justify-center gap-4 bg-black text-white">
      <h1 className="text-xl">Carregando...</h1>
      <LoadingBar progress={progress} />
      <span className="text-sm">{message}</span>
    </main>
  )
}
