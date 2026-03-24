import { pokeApiClient } from './pokeApiClient'
import type {
  NamedApiResourceList,
  PokemonApiResponse,
} from './pokeApi.types'

export const pokemonClient = {
  fetchById(id: number) {
    return pokeApiClient.getJson<PokemonApiResponse>(`pokemon/${id}`)
  },
  fetchByUrl(url: string) {
    return pokeApiClient.getJson<PokemonApiResponse>(url)
  },
  listAll() {
    return pokeApiClient.getJson<NamedApiResourceList>('pokemon?limit=10000')
  },
}
