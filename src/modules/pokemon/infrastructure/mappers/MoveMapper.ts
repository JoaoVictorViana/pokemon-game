import { PokemonMove } from '../../domain/entities/PokemonMove'
import { PokemonMoveId } from '../../domain/values-objetcts/PokemonMoveId'
import { PokemonTypeDBRepository } from '../repositories/PokemonTypeDBRepository'

export interface MoveDBModel {
  id: number
  name: string
  type_id: number
  power: number
  pp: number
  accuracy: number
}

export const PokemonMoveMapper = {
  fromApi(data: any): PokemonMove {
    return new PokemonMove(
      PokemonMoveId.create(data.id),
      data.name,
      data.type.name,
      data.power,
      data.pp,
      data.accuracy
    )
  },
  async toDB(entity: PokemonMove): Promise<MoveDBModel> {
    const type = await new PokemonTypeDBRepository().getByName(entity.type)

    return {
      id: entity.id.getValue(),
      accuracy: entity.accuracy ?? 0,
      name: entity.name,
      power: entity.power ?? 0,
      pp: entity.pp,
      type_id: type.id.getValue() ?? null,
    }
  },
}
