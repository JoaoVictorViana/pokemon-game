import type { Pokemon } from '@/modules/pokemon/domain/entities/Pokemon'
import { PokemonAudioService } from '@/modules/pokemon/domain/services/PokemonAudioService'
import { ANIMATION_POKEMON_SPRITE_SPEED } from '@/modules/pokemon/enums'
import { motion, useAnimationControls } from 'motion/react'
import { useCallback, useEffect, useMemo, useState } from 'react'

type Props = {
  pokemon: Pokemon
}

export function PokemonSprites({ pokemon }: Props) {
  const [spriteMode, setSpriteMode] = useState<'back' | 'front'>('front')
  const [shinyChecked, setShinyChecked] = useState(false)
  const animationSpriteControl = useAnimationControls()

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
  }, [])

  const sprites = useMemo(() => {
    function toObjectUrl(sprite?: ArrayBuffer) {
      if (!sprite || sprite.byteLength === 0) {
        return undefined
      }

      return URL.createObjectURL(new Blob([sprite], { type: 'image/png' }))
    }

    return {
      back: toObjectUrl(pokemon.sprites?.back),
      back_shiny: toObjectUrl(pokemon.sprites?.back_shiny),
      front: toObjectUrl(pokemon.sprites?.front),
      front_shiny: toObjectUrl(pokemon.sprites?.front_shiny),
    }
  }, [pokemon.sprites])

  const currentSprite = useMemo(() => {
    if (!shinyChecked) {
      return spriteMode === 'front' ? sprites.front : sprites.back
    }

    return spriteMode === 'front' ? sprites.front_shiny : sprites.back_shiny
  }, [spriteMode, shinyChecked, sprites])

  useEffect(() => {
    const audioService = new PokemonAudioService()

    audioService.playCry(pokemon.cry)
    void startSpriteAnimation()
  }, [pokemon.cry, startSpriteAnimation])

  useEffect(() => {
    return () => {
      if (sprites.back) URL.revokeObjectURL(sprites.back)
      if (sprites.back_shiny) URL.revokeObjectURL(sprites.back_shiny)
      if (sprites.front) URL.revokeObjectURL(sprites.front)
      if (sprites.front_shiny) URL.revokeObjectURL(sprites.front_shiny)
    }
  }, [sprites])

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
        className={`${shinyChecked ? 'bg-green-300' : 'bg-gray-300'} hover:border-gray-300 text-xs hover:bg-green-300 text-black absolute p-2 top-0 right-0 cursor-pointer rounded-full`}
        onClick={() => setShinyChecked((prev) => !prev)}
      >
        S
      </button>
    </div>
  )
}
