import { motion, useAnimationControls } from 'framer-motion'
import { useEffect, useState } from 'react'
import { GetStartersUseCase } from '../../application/use-cases/GetStartersUseCase'
import { PokemonService } from '@/modules/pokemon/domain/services/PokemonService'
import { PokemonDBRepository } from '@/modules/pokemon/infrastructure/repositories/PokemonDBRepository'
import { STARTERS } from '@/configs/app'
import type { Pokemon } from '@/modules/pokemon/domain/entities/Pokemon'
import { renderSprite } from '@/shared/utils/file'
import { audioEngine } from '@/shared/services/audio/AudioEngine'
import { Button } from '@/shared/ui/core/Button'
import { useNavigate } from 'react-router'

export function ChooseStarterPage() {
  const [selected, setSelected] = useState<Pokemon>()
  const [finished, setFinished] = useState(false)
  const [starters, setStarters] = useState<Pokemon[]>([])
  const animationSpriteControl = useAnimationControls()
  const navigate = useNavigate()

  async function select(pokemon: Pokemon) {
    audioEngine.playOneShot('/sounds/menu-click.wav', 'UI')
    // const starter = STARTERS.find((s) => s.name === name)!;
    // audio.playSfx("/sfx/select.wav");
    setSelected(pokemon)
    // await usecase.execute(starter);
    setFinished(true)
  }

  function cancelChoose() {
    setFinished(false)
    setSelected(undefined)
  }

  function confirmChoose() {
    setSelected(undefined)
    navigate('/menu')
  }

  useEffect(() => {
    const repo = new PokemonDBRepository()
    const service = new PokemonService(repo)
    const useCase = new GetStartersUseCase(service)

    useCase.execute(STARTERS).then(setStarters)
  }, [])

  if (finished) {
    return (
      <div className="w-full h-full flex-col gap-12 bg-white text-black flex items-center justify-center text-xl pixel-font">
        <span>
          Seu parceiro inicial será o{' '}
          {
            starters.find(
              (pokemon) => pokemon.id?.getValue() === selected?.id.getValue()
            )?.name
          }
          ?
        </span>

        <motion.img
          src={renderSprite(selected?.sprites?.front)}
          key={selected?.name}
          whileHover={{ scale: 1.1 }}
          className="cursor-pointer flex flex-col items-center w-40"
        />

        <div className="flex items-center gap-8">
          <Button
            onClick={cancelChoose}
            className="bg-yellow-500 cursor-pointer text-black p-4 text-xs rounded-full"
          >
            Escolher outro parceiro
          </Button>
          <Button
            onClick={confirmChoose}
            className="bg-green-500 cursor-pointer text-black p-4 text-xs rounded-full"
          >
            Confirmar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen bg-[url('/bg/oak_lab.png')] bg-cover bg-center flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-white/80 border-4 border-black rounded-xl p-6 w-[800px] flex flex-col gap-8 pixel-font"
      >
        <motion.img
          src="/images/sprites/oak.png"
          initial={{ y: -20 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-80 mx-auto"
        />

        <h1 className="text-center text-xl">Escolha seu Primeiro Pokémon!</h1>

        <div className="flex justify-center gap-10">
          {starters.map((starter) => (
            <motion.div
              key={starter.name}
              whileHover={{ scale: 1.1 }}
              onHoverStart={() =>
                audioEngine.playOneShot('/sounds/menu-hover.mp3', 'UI')
              }
              className="cursor-pointer flex flex-col items-center"
              onClick={() => select(starter)}
            >
              <motion.img
                src={renderSprite(starter.sprites?.front)}
                alt={starter.name}
                className="w-28 pixel-art"
                animate={animationSpriteControl}
              />
              <span className="mt-2 capitalize">{starter.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
