import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AudioEngine } from './AudioEngine'

class FakeAudio {
  static instances: FakeAudio[] = []

  src: string
  volume = 1
  loop = false
  paused = false
  play = vi.fn()
  pause = vi.fn(() => {
    this.paused = true
  })

  constructor(src: string) {
    this.src = src
    FakeAudio.instances.push(this)
  }
}

describe('AudioEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    FakeAudio.instances = []
    vi.stubGlobal('Audio', FakeAudio)
  })

  it('aplica volume efetivo ao reproduzir um one-shot', () => {
    const engine = new AudioEngine()

    engine.setMasterVolume(0.5)
    engine.setChannelVolume('UI', 0.4)
    engine.playOneShot('/sounds/menu-hover.mp3', 'UI')

    expect(FakeAudio.instances).toHaveLength(1)
    expect(FakeAudio.instances[0].src).toBe('/sounds/menu-hover.mp3')
    expect(FakeAudio.instances[0].volume).toBeCloseTo(0.2)
    expect(FakeAudio.instances[0].play).toHaveBeenCalledTimes(1)
  })

  it('nao reproduz one-shot em canal mutado', () => {
    const engine = new AudioEngine()

    engine.mute('UI')
    engine.playOneShot('/sounds/menu-hover.mp3', 'UI')

    expect(FakeAudio.instances).toHaveLength(0)
  })

  it('nao reinicia a mesma BGM quando a origem ja esta em reproducao', () => {
    const engine = new AudioEngine()

    engine.playBGM('/sounds/start-menu.wav')
    engine.playBGM('/sounds/start-menu.wav')

    expect(FakeAudio.instances).toHaveLength(1)
  })

  it('faz transicao entre BGMs diferentes', async () => {
    const engine = new AudioEngine()

    engine.playBGM('/sounds/first.wav', 100)
    engine.playBGM('/sounds/second.wav', 100)

    expect(FakeAudio.instances).toHaveLength(2)
    expect(FakeAudio.instances[0].pause).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(200)

    expect(FakeAudio.instances[1].loop).toBe(true)
    expect(FakeAudio.instances[1].play).toHaveBeenCalledTimes(1)
    expect(FakeAudio.instances[0].pause).toHaveBeenCalledTimes(1)
  })
})
