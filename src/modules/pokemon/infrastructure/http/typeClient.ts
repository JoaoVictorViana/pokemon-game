export const typeClient = {
  async fetchById(id: number) {
    const res = await fetch(`https://pokeapi.co/api/v2/type/${id}`)
    return res.json()
  },
}
