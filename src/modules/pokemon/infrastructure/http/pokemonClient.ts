export const pokemonClient = {
  async fetchById(id: number) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    return res.json()
  },

  async listAll() {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`)
    return res.json()
  },
}
