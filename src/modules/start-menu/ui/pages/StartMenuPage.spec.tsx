import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { StartMenuPage } from './StartMenuPage'

const navigateMock = vi.fn()
const audioEngineMock = vi.hoisted(() => ({
  playBGM: vi.fn(),
  playOneShot: vi.fn(),
}))

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>(
    'react-router'
  )

  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('@/shared/services/audio/AudioEngine', () => ({
  audioEngine: audioEngineMock,
}))

describe('StartMenuPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('inicia a musica do menu e renderiza as opcoes principais', () => {
    render(
      <MemoryRouter>
        <StartMenuPage />
      </MemoryRouter>
    )

    expect(audioEngineMock.playBGM).toHaveBeenCalledWith(
      '/sounds/start-menu.wav'
    )
    expect(
      screen.getByRole('button', { name: /Encontrar Pokemon/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Meus Pokemons/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Pokedex/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Loja/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Creditos/i })
    ).toBeInTheDocument()
  })

  it('toca som de hover ao interagir com uma opcao', () => {
    render(
      <MemoryRouter>
        <StartMenuPage />
      </MemoryRouter>
    )

    fireEvent.mouseEnter(screen.getByRole('button', { name: /Pokedex/i }))

    expect(audioEngineMock.playOneShot).toHaveBeenCalledWith(
      '/sounds/menu-hover.mp3',
      'UI'
    )
  })

  it('toca som de clique e navega para a rota selecionada', () => {
    render(
      <MemoryRouter>
        <StartMenuPage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /Pokedex/i }))

    expect(audioEngineMock.playOneShot).toHaveBeenCalledWith(
      '/sounds/menu-click.wav',
      'UI'
    )
    expect(navigateMock).toHaveBeenCalledWith('/pokedex')
  })
})
