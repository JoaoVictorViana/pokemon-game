import {
  fetchAudioAsArrayBuffer,
  fetchSpriteAsArrayBuffer,
} from '@/shared/utils/file'
import { Pokemon } from '../../domain/entities/Pokemon'
import { PokemonMove } from '../../domain/entities/PokemonMove'
import { PokemonId } from '../../domain/values-objetcts/PokemonId'
import { VERSION_DEFAULT } from '@/configs/api'
import { PokemonTypeDBRepository } from '../repositories/PokemonTypeDBRepository'
import { MoveDBRepository } from '../repositories/MoveDBRepository'

export interface PokemonDBModel {
  id: number
  name: string
  first_type_id: number
  second_type_id?: number
  height: number
  weight: number
  base_experience: number
  cry?: ArrayBuffer
  sprite_front?: ArrayBuffer
  sprite_back?: ArrayBuffer
  sprite_back_shiny?: ArrayBuffer
  sprite_front_shiny?: ArrayBuffer
  base_hp: number
  base_attack: number
  base_defense: number
  base_special_attack: number
  base_special_defense: number
  base_speed: number
}

export interface PokemonMoveDBModel {
  pokemon_id: number
  move_id: number
  level_learned_at: number
}

export const PokemonMapper = {
  async mapTypes(name: string) {
    const repo = new PokemonTypeDBRepository()
    const typeData = await repo.getByName(name)

    return typeData
  },
  async mapMove(name: string, learnedAt: number) {
    const repo = new MoveDBRepository()
    const moveData = await repo.getByName(name)

    return new PokemonMove(
      moveData.id,
      moveData.name,
      moveData.type,
      moveData.power,
      moveData.pp,
      moveData.accuracy,
      learnedAt
    )
  },
  async fromApi(data: any): Promise<Pokemon> {
    const types = await Promise.all(
      data.types.map(async (item: any) => this.mapTypes(item.type.name))
    )
    const moves = await Promise.all(
      data.moves.map(async (item: any) =>
        this.mapMove(
          item.move.name,
          item.version_group_details?.find(
            (version: any) => version.version_group.name === VERSION_DEFAULT
          )?.level_learned_at ?? 0
        )
      )
    )

    return new Pokemon(
      PokemonId.create(data.id),
      data.name,
      data.height,
      data.weight,
      data.base_experience,
      await fetchAudioAsArrayBuffer(data.cries.latest),
      {
        front: await fetchSpriteAsArrayBuffer(
          data.sprites?.front_default ?? ''
        ),
        back: await fetchSpriteAsArrayBuffer(data.sprites?.back_default ?? ''),
        back_shiny: await fetchSpriteAsArrayBuffer(
          data.sprites?.back_shiny ?? ''
        ),
        front_shiny: await fetchSpriteAsArrayBuffer(
          data.sprites?.front_shiny ?? ''
        ),
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
  },
  async toDB(entity: Pokemon): Promise<PokemonDBModel> {
    return {
      id: entity.id.getValue(),
      name: entity.name,
      first_type_id: Number(entity.types?.[0]?.id.getValue()),
      second_type_id: entity.types?.[1]?.id.getValue() ?? undefined,
      height: entity.height,
      weight: entity.weight,
      base_experience: entity.base_experience,
      cry: entity.cry,
      sprite_front: entity.sprites?.front,
      sprite_back: entity.sprites?.back,
      sprite_back_shiny: entity.sprites?.back_shiny,
      sprite_front_shiny: entity.sprites?.front_shiny,
      base_hp: entity.stats?.hp ?? 0,
      base_attack: entity.stats?.attack ?? 0,
      base_defense: entity.stats?.defense ?? 0,
      base_special_attack: entity.stats?.special_attack ?? 0,
      base_special_defense: entity.stats?.special_defense ?? 0,
      base_speed: entity.stats?.speed ?? 0,
    }
  },
  toMoveDB(entity: Pokemon, move: PokemonMove): PokemonMoveDBModel {
    return {
      level_learned_at: move.level_learned_at ?? 0,
      move_id: move.id.getValue(),
      pokemon_id: entity.id.getValue(),
    }
  },
}
