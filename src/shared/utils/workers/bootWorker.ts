import type { NamedApiResource } from '@/modules/pokemon/infrastructure/http/pokeApi.types'
import { pokemonClient } from '@/modules/pokemon/infrastructure/http/pokemonClient'
import { PokemonMapper } from '@/modules/pokemon/infrastructure/mappers/PokemonMapper'
import { MoveDBRepository } from '@/modules/pokemon/infrastructure/repositories/MoveDBRepository'
import { PokemonDBRepository } from '@/modules/pokemon/infrastructure/repositories/PokemonDBRepository'
import { PokemonTypeDBRepository } from '@/modules/pokemon/infrastructure/repositories/PokemonTypeDBRepository'
import { runWithConcurrency } from '../promise'

const CONCURRENCY_LIMIT = 5

self.onmessage = async (event: MessageEvent) => {
  const { pokemons } = event.data as { pokemons: NamedApiResource[] }
  const pokemonRepository = new PokemonDBRepository()
  const moveRepository = new MoveDBRepository()
  const pokemonTypeRepository = new PokemonTypeDBRepository()

  await runWithConcurrency(
    pokemons.map((pokemon) => async () => {
      const data = await pokemonClient.fetchByUrl(pokemon.url)

      await pokemonRepository.save(
        await PokemonMapper.fromApi(data, {
          moveRepository,
          pokemonTypeRepository,
        })
      )
    }),
    CONCURRENCY_LIMIT
  )

  self.postMessage({
    type: 'complete',
    message: 'Todos os Pokemons processados e salvos.',
  })
}
