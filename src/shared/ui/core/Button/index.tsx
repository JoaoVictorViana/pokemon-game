import type { PropsWithChildren } from 'react'
import { useButton, type ButtonProps } from './hook'

export function Button(props: PropsWithChildren<ButtonProps>) {
  const { handleClick, handleHover } = useButton(props)
  return (
    <button {...props} onMouseEnter={handleHover} onClick={handleClick}>
      {props.children}
    </button>
  )
}
