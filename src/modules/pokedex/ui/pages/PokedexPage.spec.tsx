import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PokedexPage } from './PokedexPage'

const navigateMock = vi.fn()
const handleChangeCurrentPokemon = vi.fn()
const usePokedexMock = vi.fn()

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>(
    'react-router'
  )

  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('../hooks/usePokedex', () => ({
  usePokedex: () => usePokedexMock(),
}))

vi.mock('../components/PokemonList', () => ({
  PokemonList: ({
    pokemons,
    onSelect,
  }: {
    pokemons: Array<{ id?: { getValue: () => number }; name?: string }>
    onSelect: (id: number) => void
  }) => (
    <div>
      {pokemons.map((pokemon) => (
        <button
          key={pokemon.id?.getValue()}
          onClick={() => pokemon.id && onSelect(pokemon.id.getValue())}
        >
          {pokemon.name}
        </button>
      ))}
    </div>
  ),
}))

vi.mock('../components/PokemonDetails', () => ({
  PokemonDetails: ({
    pokemon,
  }: {
    pokemon: { id: { getValue: () => number }; name: string }
  }) => <div>{`#${pokemon.id.getValue()} - ${pokemon.name}`}</div>,
}))

describe('PokedexPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exibe fallback de carregamento enquanto nao ha pokemon selecionado', () => {
    usePokedexMock.mockReturnValue({
      currentPokemon: undefined,
      pokemons: [],
      handleChangeCurrentPokemon,
      loading: true,
    })

    render(
      <MemoryRouter>
        <PokedexPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Carregando Pokedex...')).toBeInTheDocument()
  })

  it('renderiza a listagem, detalhes e permite voltar e selecionar outro pokemon', () => {
    usePokedexMock.mockReturnValue({
      currentPokemon: {
        id: { getValue: () => 1 },
        name: 'bulbasaur',
      },
      pokemons: [
        { id: { getValue: () => 1 }, name: 'bulbasaur' },
        { id: { getValue: () => 2 }, name: 'ivysaur' },
      ],
      handleChangeCurrentPokemon,
      loading: false,
    })

    render(
      <MemoryRouter>
        <PokedexPage />
      </MemoryRouter>
    )

    expect(screen.getByText('#1 - bulbasaur')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '<' }))
    expect(navigateMock).toHaveBeenCalledWith(-1)

    fireEvent.click(screen.getByText('ivysaur'))
    expect(handleChangeCurrentPokemon).toHaveBeenCalledWith(2)
  })
})
