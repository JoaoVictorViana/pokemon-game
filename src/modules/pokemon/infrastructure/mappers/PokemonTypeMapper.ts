import { VERSION_DEFAULT } from '@/configs/api'
import { PokemonType } from '../../domain/entities/PokemonType'
import { PokemonTypeId } from '../../domain/value-objects/PokemonTypeId'
import { typeClient } from '../http/typeClient'
import type {
  NamedApiResource,
  TypeApiResponse,
} from '../http/pokeApi.types'

export interface PokemonTypeDBModel {
  id: number
  name: string
  sprite: string
}

export interface PokemonTypeEffectivenessDBModel {
  attacker_type_id: number
  defender_type_id: number
  effectiveness: 'DOUBLE' | 'HALF' | 'NO_DAMAGE' | 'NORMAL'
}

export const PokemonTypeMapper = {
  async mapTypes(list: NamedApiResource[] | undefined) {
    if (!list) return []

    return Promise.all(
      list.map(async (type) => {
        const typeData = await typeClient.fetchByUrl(type.url)

        return new PokemonType(
          PokemonTypeId.create(typeData.id),
          typeData.name,
          typeData.sprites?.['generation-v']?.[VERSION_DEFAULT]?.name_icon ??
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
  },
  async fromApi(data: TypeApiResponse): Promise<PokemonType> {
    const doubleDamageFrom = await this.mapTypes(
      data.damage_relations.double_damage_from
    )
    const doubleDamageTo = await this.mapTypes(
      data.damage_relations.double_damage_to
    )

    const halfDamageFrom = await this.mapTypes(
      data.damage_relations.half_damage_from
    )
    const halfDamageTo = await this.mapTypes(
      data.damage_relations.half_damage_to
    )

    const noDamageFrom = await this.mapTypes(
      data.damage_relations.no_damage_from
    )
    const noDamageTo = await this.mapTypes(data.damage_relations.no_damage_to)

    return new PokemonType(
      PokemonTypeId.create(data.id),
      data.name,
      data.sprites?.['generation-v']?.[VERSION_DEFAULT]?.name_icon ?? '',
      doubleDamageFrom,
      doubleDamageTo,
      halfDamageFrom,
      halfDamageTo,
      noDamageFrom,
      noDamageTo,
      [],
      []
    )
  },
  toDB(entity: PokemonType): PokemonTypeDBModel {
    return {
      id: entity.id.getValue(),
      name: entity.name,
      sprite: entity.sprite,
    }
  },
  toEffectivenessDB(
    entity: PokemonType,
    type: PokemonType,
    effectiveness: 'DOUBLE' | 'HALF' | 'NO_DAMAGE'
  ): PokemonTypeEffectivenessDBModel {
    return {
      attacker_type_id: entity.id.getValue(),
      defender_type_id: type.id.getValue(),
      effectiveness,
    }
  },
}

