type AudioChannel = 'MASTER' | 'BGM' | 'SFX' | 'UI'

interface ChannelState {
  volume: number
  muted: boolean
}

export class AudioEngine {
  private audioCtx: AudioContext
  private channels: Record<AudioChannel, ChannelState>
  private currentBGM: HTMLAudioElement | null = null

  constructor() {
    this.audioCtx = new AudioContext()

    this.channels = {
      MASTER: { volume: 1, muted: false },
      BGM: { volume: 0.8, muted: false },
      SFX: { volume: 1, muted: false },
      UI: { volume: 1, muted: false },
    }
  }

  /** Global volume */
  setMasterVolume(v: number) {
    this.channels.MASTER.volume = v
  }

  /** Per-channel volume */
  setChannelVolume(ch: AudioChannel, v: number) {
    this.channels[ch].volume = v
  }

  mute(ch: AudioChannel) {
    this.channels[ch].muted = true
  }

  unmute(ch: AudioChannel) {
    this.channels[ch].muted = false
  }

  /** Play SFX / UI instantly */
  playOneShot(src: string, channel: AudioChannel = 'SFX') {
    if (this.channels[channel].muted) return

    const audio = new Audio(src)
    audio.volume = this.channels[channel].volume * this.channels.MASTER.volume
    audio.play()
  }

  /** Background music with crossfade */
  playBGM(src: string, fadeDuration = 800) {
    if (this.currentBGM?.src.endsWith(src)) return

    const newBGM = new Audio(src)
    newBGM.loop = true
    newBGM.volume = 0.01

    newBGM.play()
    this.fadeIn(newBGM, fadeDuration)

    if (this.currentBGM) {
      this.fadeOut(this.currentBGM, fadeDuration)
    }

    this.currentBGM = newBGM
  }

  private fadeIn(audio: HTMLAudioElement, duration: number) {
    const step = 0.01
    let vol = 0

    const id = setInterval(() => {
      vol += step
      audio.volume = vol * this.channels.BGM.volume
      if (vol >= 1) clearInterval(id)
    }, duration * step)
  }

  private fadeOut(audio: HTMLAudioElement, duration: number) {
    const step = 0.01
    let vol = audio.volume

    const id = setInterval(() => {
      vol -= step
      audio.volume = vol
      if (vol <= 0) {
        audio.pause()
        clearInterval(id)
      }
    }, duration * step)
  }
}

export const audioEngine = new AudioEngine()
