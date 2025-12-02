export const moveClient = {
  async fetchById(id: number) {
    const res = await fetch(`https://pokeapi.co/api/v2/move/${id}`)
    return res.json()
  },
  async fetchByUrl(url: string) {
    const res = await fetch(url)
    return res.json()
  },
  async listAll() {
    const res = await fetch(`https://pokeapi.co/api/v2/move?limit=10000`)
    return res.json()
  },
}
