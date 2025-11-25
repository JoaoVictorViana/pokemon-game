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
        ? pokemon.sprites.front
        : pokemon.sprites.back
    }

    return spriteMode === 'front'
      ? pokemon.sprites.front_shiny
      : pokemon.sprites.back_shiny
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
    <div>
      <motion.img
        src={currentSprite}
        alt={pokemon.name}
        animate={animationSpriteControl}
      />
      <div className="flex gap-2">
        <button onClick={handleChangePosition}>{'<'}</button>
        <button onClick={handleChangePosition}>{'>'}</button>
        <div>
          <input
            id="active-shiny"
            type="checkbox"
            onChange={(e) => setShinyChecked(e.target.checked)}
          />
          <label htmlFor="#active-shiny">Modo shiny?</label>
        </div>
      </div>
    </div>
  )
}
