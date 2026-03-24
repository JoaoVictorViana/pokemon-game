import { pokeApiClient } from './pokeApiClient'
import type { MoveApiResponse, NamedApiResourceList } from './pokeApi.types'

export const moveClient = {
  fetchById(id: number) {
    return pokeApiClient.getJson<MoveApiResponse>(`move/${id}`)
  },
  fetchByUrl(url: string) {
    return pokeApiClient.getJson<MoveApiResponse>(url)
  },
  listAll() {
    return pokeApiClient.getJson<NamedApiResourceList>('move?limit=10000')
  },
}
