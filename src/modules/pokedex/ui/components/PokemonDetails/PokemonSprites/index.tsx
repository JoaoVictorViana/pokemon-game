import type { Pokemon } from '@/modules/pokemon/domain/entities/Pokemon'
import { PokemonAudioService } from '@/modules/pokemon/domain/services/PokemonAudioService'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { ANIMATION_POKEMON_SPRITE_SPEED } from '@/modules/pokemon/enums'

type Props = {
  pokemon: Pokemon
}

export function PokemonSprites({ pokemon }: Props) {
  const [spriteMode, setSpriteMode] = useState<'back' | 'front'>('front')
  const [shinyChecked, setShinyChecked] = useState(false)
  const animationSpriteControl = useAnimationControls()

  const currentSprite = useMemo(() => {
    if (!shinyChecked) {
      return spriteMode === 'front'
        ? pokemon.sprites?.front
        : pokemon.sprites?.back
    }

    return spriteMode === 'front'
      ? pokemon.sprites?.front_shiny
      : pokemon.sprites?.back_shiny
  }, [spriteMode, shinyChecked, pokemon])

  const startSpriteAnimation = useCallback(() => {
    animationSpriteControl.start({
      y: [0, -10, 0],
      transition: {
        duration: ANIMATION_POKEMON_SPRITE_SPEED,
        ease: 'easeInOut',
        repeat: 2,
      },
    })
  }, [animationSpriteControl])

  const handleChangePosition = useCallback(() => {
    setSpriteMode((prev) => (prev === 'back' ? 'front' : 'back'))
  }, [setSpriteMode])

  useEffect(() => {
    const audioService = new PokemonAudioService()
    audioService.playCry(pokemon.cry)
    startSpriteAnimation()
  }, [pokemon, currentSprite, startSpriteAnimation])

  return (
    <div className="relative w-auto h-auto">
      <motion.img
        src={currentSprite}
        alt={pokemon.name}
        className="w-[200px]"
        animate={animationSpriteControl}
      />
      <button
        className="absolute top-[50%] left-0 cursor-pointer"
        onClick={handleChangePosition}
      >
        {'<'}
      </button>
      <button
        className="absolute top-[50%] right-0 cursor-pointer"
        onClick={handleChangePosition}
      >
        {'>'}
      </button>
      <button
        className={`${shinyChecked ? 'bg-green-300' : 'bg-gray-300'}  hover:border-gray-300 text-xs hover:bg-green-300 text-black absolute p-2 top-0 right-0 cursor-pointer rounded-full`}
        onClick={() => setShinyChecked((prev) => !prev)}
      >
        S
      </button>
    </div>
  )
}
