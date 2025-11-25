import { Pokemon } from '../../domain/entities/Pokemon'
import { PokemonMove } from '../../domain/entities/PokemonMove'
import { PokemonType } from '../../domain/entities/PokemonType'
import { PokemonId } from '../../domain/values-objetcts/PokemonId'
import { moveClient } from '../http/moveClient'
import { pokemonClient } from '../http/pokemonClient'
import { typeClient } from '../http/typeClient'
import type { IPokemonRepository } from './IPokemonRepository'

export class PokemonApiRepository implements IPokemonRepository {
  async getById(id: PokemonId): Promise<Pokemon> {
    const data = await pokemonClient.fetchById(id.getValue())
    const types = await Promise.all(
      data.types.map(async (type: { type: { url: string } }) => {
        const id = type.type?.url.match(/\/(\d+)\/?$/)?.[1] ?? null

        if (!id) return null

        const pokemonType = await typeClient.fetchById(Number(id))
        return new PokemonType(
          pokemonType.name,
          pokemonType.sprites['generation-v']?.['black-2-white-2']?.name_icon ??
            '',
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          []
        )
      })
    )

    const moves = await Promise.all(
      data.moves.map(async (move: { move: { url: string } }) => {
        const id = move.move?.url.match(/\/(\d+)\/?$/)?.[1] ?? null

        if (!id) return null

        const pokemonMove = await moveClient.fetchById(Number(id))
        return new PokemonMove(
          pokemonMove.name,
          pokemonMove.type.name,
          pokemonMove.power,
          pokemonMove.pp,
          pokemonMove.accuracy
        )
      })
    )

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
      moves,
      types,
      {
        hp: data.stats.find((stat: any) => stat.stat.name === 'hp')?.base_stat,
        attack: data.stats.find((stat: any) => stat.stat.name === 'attack')
          ?.base_stat,
        defense: data.stats.find((stat: any) => stat.stat.name === 'defense')
          ?.base_stat,
        special_attack: data.stats.find(
          (stat: any) => stat.stat.name === 'special_attack'
        )?.base_stat,
        special_defense: data.stats.find(
          (stat: any) => stat.stat.name === 'special_defense'
        )?.base_stat,
        speed: data.stats.find((stat: any) => stat.stat.name === 'speed')
          ?.base_stat,
      }
    )
  }

  async listAll(): Promise<Partial<Pokemon>[]> {
    const data = await pokemonClient.listAll()

    return data.results.map(
       
      (p: any, index: number) =>
        new Pokemon(PokemonId.create(index + 1), p.name, 0, 0, 0, '')
    )
  }
}
