export const typeClient = {
  async fetchById(id: number) {
    const res = await fetch(`https://pokeapi.co/api/v2/type/${id}`)
    return res.json()
  },
  async fetchByUrl(url: string) {
    const res = await fetch(url)
    return res.json()
  },
  async listAll() {
    const res = await fetch(`https://pokeapi.co/api/v2/type?limit=1000`)
    return res.json()
  },
}
