export interface NamedApiResource {
  name: string
  url: string
}

export interface NamedApiResourceList {
  count: number
  next: string | null
  previous: string | null
  results: NamedApiResource[]
}

export interface PokemonApiResponse {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number
  cries: {
    latest: string
  }
  sprites: {
    front_default: string | null
    back_default: string | null
    front_shiny: string | null
    back_shiny: string | null
  }
  stats: Array<{
    base_stat: number
    stat: {
      name: string
    }
  }>
  types: Array<{
    slot: number
    type: NamedApiResource
  }>
  moves: Array<{
    move: NamedApiResource
    version_group_details: Array<{
      level_learned_at: number
      version_group: {
        name: string
      }
    }>
  }>
}

export interface MoveApiResponse {
  id: number
  name: string
  power: number | null
  pp: number
  accuracy: number | null
  type: {
    name: string
  }
}

export interface TypeApiResponse {
  id: number
  name: string
  sprites?: {
    'generation-v'?: Record<
      string,
      {
        name_icon?: string
      }
    >
  }
  damage_relations: {
    double_damage_from: NamedApiResource[]
    double_damage_to: NamedApiResource[]
    half_damage_from: NamedApiResource[]
    half_damage_to: NamedApiResource[]
    no_damage_from: NamedApiResource[]
    no_damage_to: NamedApiResource[]
  }
}
