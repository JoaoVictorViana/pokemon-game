import { audioEngine } from '@/shared/services/audio/AudioEngine'
import type { HtmlHTMLAttributes, MouseEvent } from 'react'

export type ButtonProps = HtmlHTMLAttributes<HTMLButtonElement>

export function useButton(props: ButtonProps) {
  const handleHover = () =>
    audioEngine.playOneShot('/sounds/menu-hover.mp3', 'UI')

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    audioEngine.playOneShot('/sounds/menu-click.wav', 'UI')
    props.onClick && props.onClick(e)
  }

  return {
    handleClick,
    handleHover,
  }
}
