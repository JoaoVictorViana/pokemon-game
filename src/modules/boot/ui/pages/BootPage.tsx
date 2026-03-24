import { useEffect, useState } from 'react'
import { LoadingBar } from '../components/LoadingBar'
import { useNavigate } from 'react-router'
import { createLoadGameResourcesUseCase } from '../../application/factories/createLoadGameResourcesUseCase'

export function BootPage() {
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('Inicializando...')
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const useCase = createLoadGameResourcesUseCase()

    void useCase
      .execute((p, m) => {
        if (!active) {
          return
        }

        setProgress(p)
        setMessage(m)

        if (p >= 100) {
          timeoutId = setTimeout(() => navigate('/menu'), 500)
        }
      })
      .catch((error: Error) => {
        if (!active) {
          return
        }

        setMessage(error.message)
      })

    return () => {
      active = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [navigate])

  return (
    <main className="w-full h-full flex flex-col items-center justify-center gap-4 bg-black text-white">
      <h1 className="text-xl">Carregando...</h1>
      <LoadingBar progress={progress} />
      <span className="text-sm">{message}</span>
    </main>
  )
}
