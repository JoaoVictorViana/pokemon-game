export class PokemonAudioService {
  playCry(arrayBufferCry: ArrayBuffer): void {
    const audioBlob = new Blob([arrayBufferCry], { type: 'audio/ogg' })

    const audioUrl = URL.createObjectURL(audioBlob)

    const audio = new Audio(audioUrl)
    audio.play()

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl)
    }
  }
}
