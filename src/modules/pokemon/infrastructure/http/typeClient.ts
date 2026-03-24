import { pokeApiClient } from './pokeApiClient'
import type { NamedApiResourceList, TypeApiResponse } from './pokeApi.types'

export const typeClient = {
  fetchById(id: number) {
    return pokeApiClient.getJson<TypeApiResponse>(`type/${id}`)
  },
  fetchByUrl(url: string) {
    return pokeApiClient.getJson<TypeApiResponse>(url)
  },
  listAll() {
    return pokeApiClient.getJson<NamedApiResourceList>('type?limit=1000')
  },
}
