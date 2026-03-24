import { useState, useRef, useEffect } from 'react'
import { useAudio } from '../AudioProvider'

function VolumeHighIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
}

function VolumeLowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
}

function VolumeMuteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}

function getVolumeIcon(volume: number, muted: boolean) {
  if (muted || volume === 0) return <VolumeMuteIcon />
  if (volume < 0.5) return <VolumeLowIcon />
  return <VolumeHighIcon />
}

export function AudioControlButton() {
  const { masterVolume, isMasterMuted, setMasterVolume, toggleMute } = useAudio()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
        title="Audio"
      >
        {getVolumeIcon(masterVolume, isMasterMuted)}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute top-10 right-0 bg-gray-900/95 backdrop-blur-sm rounded-lg p-3 flex flex-col gap-3 min-w-[160px] shadow-lg border border-gray-700 z-50"
        >
          <div className="flex items-center justify-between">
            <span className="text-white text-[8px] uppercase tracking-wider">Volume</span>
            <button
              onClick={toggleMute}
              className="text-white/70 hover:text-white transition-colors cursor-pointer"
              title={isMasterMuted ? 'Ativar som' : 'Silenciar'}
            >
              {getVolumeIcon(masterVolume, isMasterMuted)}
            </button>
          </div>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMasterMuted ? 0 : masterVolume}
            onChange={(e) => {
              const val = parseFloat(e.target.value)
              if (isMasterMuted && val > 0) toggleMute()
              setMasterVolume(val)
            }}
            className="w-full h-1 accent-red-400 cursor-pointer"
          />

          <span className="text-white/50 text-[7px] text-center">
            {isMasterMuted ? 'MUDO' : `${Math.round(masterVolume * 100)}%`}
          </span>
        </div>
      )}
    </div>
  )
}
