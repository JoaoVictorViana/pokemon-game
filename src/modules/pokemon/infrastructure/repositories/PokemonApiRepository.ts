import { Pokemon } from '../../domain/entities/Pokemon'
import { PokemonId } from '../../domain/values-objetcts/PokemonId'
import { pokemonClient } from '../http/pokemonClient'
import type { IPokemonRepository } from './IPokemonRepository'

export class PokemonApiRepository implements IPokemonRepository {
  async getById(id: PokemonId): Promise<Pokemon> {
    const data = await pokemonClient.fetchById(id.getValue())

    return new Pokemon(
      PokemonId.create(data.id),
      data.name,
      data.height,
      data.weight,
      data.base_experience,
      data.cries.latest,
      {
        front: data.sprites.front_default,
        back: data.sprites.back_default,
        back_shiny: data.sprites.back_shiny,
        front_shiny: data.sprites.front_shiny,
      },
      []
    )
  }

  async listAll(): Promise<Pokemon[]> {
    const data = await pokemonClient.listAll()

    return data.results.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: any, index: number) =>
        new Pokemon(
          PokemonId.create(index + 1),
          p.name,
          data.height,
          data.weight,
          data.base_experience,
          data.cries.latest,
          {
            front: data.sprites.front_default,
            back: data.sprites.back_default,
            back_shiny: data.sprites.back_shiny,
            front_shiny: data.sprites.front_shiny,
          },
          []
        )
    )
  }
}
