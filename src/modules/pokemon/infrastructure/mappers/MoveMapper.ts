import { PokemonMove } from '../../domain/entities/PokemonMove'
import { PokemonMoveId } from '../../domain/value-objects/PokemonMoveId'
import type { MoveApiResponse } from '../http/pokeApi.types'

export interface MoveDBModel {
  id: number
  name: string
  type_id: number
  power: number
  pp: number
  accuracy: number
}

export const PokemonMoveMapper = {
  fromApi(data: MoveApiResponse): PokemonMove {
    return new PokemonMove(
      PokemonMoveId.create(data.id),
      data.name,
      data.type.name,
      data.power ?? 0,
      data.pp,
      data.accuracy ?? 0
    )
  },
  toDB(entity: PokemonMove, typeId: number): MoveDBModel {
    return {
      id: entity.id.getValue(),
      accuracy: entity.accuracy,
      name: entity.name,
      power: entity.power,
      pp: entity.pp,
      type_id: typeId,
    }
  },
}

