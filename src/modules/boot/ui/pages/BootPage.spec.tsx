import { act, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BootPage } from './BootPage'

const navigateMock = vi.fn()
const executeMock = vi.fn()
const checkStarterPokemonSelectionExecuteMock = vi.fn()

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>(
    'react-router'
  )

  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('../../application/factories/createLoadGameResourcesUseCase', () => ({
  createLoadGameResourcesUseCase: () => ({
    execute: executeMock,
  }),
}))

vi.mock('@/modules/pokemon/application/createStarterSelectionDependencies', () => ({
  createStarterSelectionDependencies: () => ({
    checkStarterPokemonSelection: {
      execute: checkStarterPokemonSelectionExecuteMock,
    },
  }),
}))

describe('BootPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    checkStarterPokemonSelectionExecuteMock.mockResolvedValue(false)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('navega para a selecao inicial quando o usuario ainda nao confirmou um pokemon', async () => {
    vi.useFakeTimers()

    executeMock.mockImplementationOnce(
      async (update: (progress: number, message: string) => void) => {
        update(35, 'Carregando tipos...')
        update(100, 'Dados carregados!')
      }
    )

    render(
      <MemoryRouter>
        <BootPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Carregando...')).toBeInTheDocument()

    await act(async () => {
      await Promise.resolve()
    })

    expect(screen.getByText('Dados carregados!')).toBeInTheDocument()
    expect(navigateMock).not.toHaveBeenCalled()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })

    expect(navigateMock).toHaveBeenCalledWith('/starter-selection')
  })

  it('navega para o menu quando o pokemon inicial ja foi confirmado', async () => {
    vi.useFakeTimers()
    checkStarterPokemonSelectionExecuteMock.mockResolvedValueOnce(true)

    executeMock.mockImplementationOnce(
      async (update: (progress: number, message: string) => void) => {
        update(100, 'Dados carregados!')
      }
    )

    render(
      <MemoryRouter>
        <BootPage />
      </MemoryRouter>
    )

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })

    expect(navigateMock).toHaveBeenCalledWith('/menu')
  })

  it('exibe a mensagem de erro quando o boot falha', async () => {
    executeMock.mockRejectedValueOnce(new Error('Falha ao carregar recursos'))

    render(
      <MemoryRouter>
        <BootPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(
        screen.getByText('Falha ao carregar recursos')
      ).toBeInTheDocument()
    })

    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('cancela a navegacao agendada ao desmontar o componente', async () => {
    vi.useFakeTimers()

    executeMock.mockImplementationOnce(
      async (update: (progress: number, message: string) => void) => {
        update(100, 'Dados carregados!')
      }
    )

    const { unmount } = render(
      <MemoryRouter>
        <BootPage />
      </MemoryRouter>
    )

    await act(async () => {
      await Promise.resolve()
    })

    expect(screen.getByText('Dados carregados!')).toBeInTheDocument()

    unmount()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })

    expect(navigateMock).not.toHaveBeenCalled()
  })
})
