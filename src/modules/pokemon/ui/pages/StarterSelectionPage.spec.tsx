import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { StarterSelectionPage } from './StarterSelectionPage'
import { Pokemon } from '../../domain/entities/Pokemon'
import { PokemonId } from '../../domain/value-objects/PokemonId'
import { PokemonType } from '../../domain/entities/PokemonType'
import { PokemonTypeId } from '../../domain/value-objects/PokemonTypeId'

const navigateMock = vi.fn()
const getStarterPokemonsExecuteMock = vi.fn()
const confirmStarterPokemonExecuteMock = vi.fn()

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>(
    'react-router'
  )

  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('../../application/createStarterSelectionDependencies', () => ({
  createStarterSelectionDependencies: () => ({
    getStarterPokemons: {
      execute: getStarterPokemonsExecuteMock,
    },
    confirmStarterPokemon: {
      execute: confirmStarterPokemonExecuteMock,
    },
  }),
}))

function createPokemon(id: number, name: string) {
  return new Pokemon(
    PokemonId.create(id),
    name,
    1,
    1,
    1,
    new ArrayBuffer(1),
    {
      front: new ArrayBuffer(1),
      back: new ArrayBuffer(1),
      front_shiny: new ArrayBuffer(1),
      back_shiny: new ArrayBuffer(1),
    },
    [],
    [
      new PokemonType(
        PokemonTypeId.create(12),
        'grass',
        '',
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
      ),
    ],
    {
      hp: 45,
      attack: 49,
      defense: 49,
      special_attack: 65,
      special_defense: 65,
      speed: 45,
    }
  )
}

describe('StarterSelectionPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getStarterPokemonsExecuteMock.mockResolvedValue([
      createPokemon(1, 'bulbasaur'),
      createPokemon(4, 'charmander'),
      createPokemon(7, 'squirtle'),
    ])
    confirmStarterPokemonExecuteMock.mockResolvedValue(true)
  })

  it('renderiza os tres pokemons iniciais e exibe confirmacao ao selecionar', async () => {
    render(
      <MemoryRouter>
        <StarterSelectionPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('starter-option-1')).toBeInTheDocument()
      expect(screen.getByTestId('starter-option-4')).toBeInTheDocument()
      expect(screen.getByTestId('starter-option-7')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('starter-option-4'))

    const confirmation = screen.getByTestId('starter-confirmation')

    expect(confirmation).toBeInTheDocument()
    expect(within(confirmation).getByText(/charmander/i)).toBeInTheDocument()
  })

  it('permite cancelar a confirmacao e voltar ao estado de selecao', async () => {
    render(
      <MemoryRouter>
        <StarterSelectionPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('starter-option-1')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('starter-option-1'))
    fireEvent.click(screen.getByRole('button', { name: 'Nao' }))

    expect(screen.queryByTestId('starter-confirmation')).not.toBeInTheDocument()
  })

  it('confirma o pokemon escolhido e navega para o menu', async () => {
    render(
      <MemoryRouter>
        <StarterSelectionPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('starter-option-7')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('starter-option-7'))
    fireEvent.click(screen.getByRole('button', { name: 'Sim' }))

    await waitFor(() => {
      expect(confirmStarterPokemonExecuteMock).toHaveBeenCalledWith(7)
      expect(navigateMock).toHaveBeenCalledWith('/menu')
    })
  })
})
