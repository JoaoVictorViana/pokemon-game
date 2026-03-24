import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PokemonSprites } from './index'

const playCryMock = vi.fn()
const startMock = vi.fn()

vi.mock('@/modules/pokemon/domain/services/PokemonAudioService', () => ({
  PokemonAudioService: vi.fn().mockImplementation(() => ({
    playCry: playCryMock,
  })),
}))

vi.mock('motion/react', () => ({
  motion: {
    img: (props: Record<string, unknown>) => <img {...props} />,
  },
  useAnimationControls: () => ({
    start: startMock,
  }),
}))

describe('PokemonSprites', () => {
  const createObjectURLMock = vi.fn()
  const revokeObjectURLMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    createObjectURLMock.mockReset()
    revokeObjectURLMock.mockReset()
    createObjectURLMock
      .mockReturnValueOnce('back-url')
      .mockReturnValueOnce('back-shiny-url')
      .mockReturnValueOnce('front-url')
      .mockReturnValueOnce('front-shiny-url')

    URL.createObjectURL = createObjectURLMock
    URL.revokeObjectURL = revokeObjectURLMock
  })

  it('toca o cry, inicia a animacao e alterna entre sprites normal e shiny', () => {
    render(
      <PokemonSprites
        pokemon={{
          name: 'bulbasaur',
          cry: new ArrayBuffer(8),
          sprites: {
            front: new ArrayBuffer(8),
            back: new ArrayBuffer(8),
            back_shiny: new ArrayBuffer(8),
            front_shiny: new ArrayBuffer(8),
          },
        } as never}
      />
    )

    const image = screen.getByAltText('bulbasaur') as HTMLImageElement
    const [leftButton, rightButton] = screen.getAllByRole('button', {
      name: /^[<>]$/,
    })
    const shinyButton = screen.getByRole('button', { name: 'S' })

    expect(playCryMock).toHaveBeenCalledWith(expect.any(ArrayBuffer))
    expect(startMock).toHaveBeenCalledTimes(1)
    expect(image.src).toContain('front-url')

    fireEvent.click(rightButton)
    expect(image.src).toContain('back-url')

    fireEvent.click(shinyButton)
    expect(image.src).toContain('back-shiny-url')

    fireEvent.click(leftButton)
    expect(image.src).toContain('front-shiny-url')
  })

  it('revoga todas as object URLs ao desmontar', () => {
    const { unmount } = render(
      <PokemonSprites
        pokemon={{
          name: 'bulbasaur',
          cry: new ArrayBuffer(8),
          sprites: {
            front: new ArrayBuffer(8),
            back: new ArrayBuffer(8),
            back_shiny: new ArrayBuffer(8),
            front_shiny: new ArrayBuffer(8),
          },
        } as never}
      />
    )

    unmount()

    expect(revokeObjectURLMock).toHaveBeenCalledWith('front-url')
    expect(revokeObjectURLMock).toHaveBeenCalledWith('back-url')
    expect(revokeObjectURLMock).toHaveBeenCalledWith('back-shiny-url')
    expect(revokeObjectURLMock).toHaveBeenCalledWith('front-shiny-url')
  })
})
