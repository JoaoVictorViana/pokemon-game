import { pokemonClient } from '@/modules/pokemon/infrastructure/http/pokemonClient'
import { PokemonMapper } from '@/modules/pokemon/infrastructure/mappers/PokemonMapper'
import { PokemonDBRepository } from '@/modules/pokemon/infrastructure/repositories/PokemonDBRepository'

// Define o limite de concorrência
const CONCURRENCY_LIMIT = 5

self.onmessage = async (e: MessageEvent) => {
  const { pokemons } = e.data
  const repository = new PokemonDBRepository()

  const tasks = pokemons.map((pokemon: any) => async () => {
    try {
      const data = await pokemonClient.fetchByUrl(pokemon.url)

      await repository.save(await PokemonMapper.fromApi(data))

      //   self.postMessage({
      //     type: 'progress',
      //     id: pokemon.id,
      //     name: pokemon.name,
      //   })
    } catch (error) {
      console.error(`Erro ao processar ${pokemon.name}:`, error)
    }
  })

  for (let i = 0; i < tasks.length; i += CONCURRENCY_LIMIT) {
    const batch = tasks.slice(i, i + CONCURRENCY_LIMIT)

    await Promise.all(batch.map((task: any) => task()))
  }

  // 4. Enviar Mensagem de Conclusão
  self.postMessage({
    type: 'complete',
    message: 'Todos os Pokémons processados e salvos.',
  })
}
