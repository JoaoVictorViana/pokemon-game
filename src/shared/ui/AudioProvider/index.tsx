import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import {
  audioEngine,
  type AudioChannel,
} from '../../services/audio/AudioEngine'

interface AudioContextValue {
  masterVolume: number
  isMasterMuted: boolean
  setMasterVolume: (v: number) => void
  toggleMute: () => void
  getChannelVolume: (ch: AudioChannel) => number
  setChannelVolume: (ch: AudioChannel, v: number) => void
}

const AudioContext = createContext<AudioContextValue | null>(null)

function useAudioSnapshot() {
  return useSyncExternalStore(
    (cb) => audioEngine.subscribe(cb),
    () => ({
      masterVolume: audioEngine.getMasterVolume(),
      isMasterMuted: audioEngine.isMuted('MASTER'),
    })
  )
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const snapshot = useAudioSnapshot()

  const setMasterVolume = useCallback((v: number) => {
    audioEngine.setMasterVolume(v)
  }, [])

  const toggleMute = useCallback(() => {
    if (audioEngine.isMuted('MASTER')) {
      audioEngine.unmute('MASTER')
    } else {
      audioEngine.mute('MASTER')
    }
  }, [])

  const getChannelVolume = useCallback((ch: AudioChannel) => {
    return audioEngine.getChannelVolume(ch)
  }, [])

  const setChannelVolume = useCallback((ch: AudioChannel, v: number) => {
    audioEngine.setChannelVolume(ch, v)
  }, [])

  return (
    <AudioContext.Provider
      value={{
        masterVolume: snapshot.masterVolume,
        isMasterMuted: snapshot.isMasterMuted,
        setMasterVolume,
        toggleMute,
        getChannelVolume,
        setChannelVolume,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAudio() {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error('useAudio must be used within AudioProvider')
  return ctx
}
