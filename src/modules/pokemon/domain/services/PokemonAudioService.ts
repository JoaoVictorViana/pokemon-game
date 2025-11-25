export class PokemonAudioService {
  playCry(url: string): void {
    const audio = new Audio(url)
    audio.play()
  }
}
