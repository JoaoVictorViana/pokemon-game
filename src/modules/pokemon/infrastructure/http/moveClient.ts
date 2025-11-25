export const moveClient = {
  async fetchById(id: number) {
    const res = await fetch(`https://pokeapi.co/api/v2/move/${id}`)
    return res.json()
  },
}
