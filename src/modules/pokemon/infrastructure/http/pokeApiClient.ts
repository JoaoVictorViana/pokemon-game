const POKE_API_BASE_URL = 'https://pokeapi.co/api/v2'

function buildUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl
  }

  return `${POKE_API_BASE_URL}/${pathOrUrl.replace(/^\//, '')}`
}

export const pokeApiClient = {
  async getJson<T>(pathOrUrl: string): Promise<T> {
    const url = buildUrl(pathOrUrl)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`PokeAPI request failed (${response.status}) for ${url}`)
    }

    return response.json() as Promise<T>
  },
}
