import { openDB } from 'idb'

export const DB_NAME = 'pokemon-db'
export const DB_VERSION = 2
export const DB_TABLES = {
  app_metadata: 'app_metadata',
  moves: 'moves',
  pokemons: 'pokemons',
  pokemon_moves: 'pokemon_moves',
  user_pokemons: 'user_pokemons',
  user_pokemon_moves: 'user_pokemon_moves',
  types: 'pokemon_types',
  type_effectiveness: 'pokemon_type_effectiveness',
}

export const indexedDb = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(DB_TABLES.types)) {
      const store = db.createObjectStore(DB_TABLES.types, { keyPath: 'id' })
      store.createIndex('name', 'name', { unique: true })
    }

    if (!db.objectStoreNames.contains(DB_TABLES.type_effectiveness)) {
      db.createObjectStore(DB_TABLES.type_effectiveness, {
        keyPath: 'id',
        autoIncrement: true,
      })
    }

    if (!db.objectStoreNames.contains(DB_TABLES.moves)) {
      const store = db.createObjectStore(DB_TABLES.moves, {
        keyPath: 'id',
      })
      store.createIndex('name', 'name', { unique: true })
    }

    if (!db.objectStoreNames.contains(DB_TABLES.pokemons)) {
      const store = db.createObjectStore(DB_TABLES.pokemons, {
        keyPath: 'id',
      })
      store.createIndex('name', 'name', { unique: true })
    }

    if (!db.objectStoreNames.contains(DB_TABLES.pokemon_moves)) {
      const store = db.createObjectStore(DB_TABLES.pokemon_moves, {
        keyPath: 'id',
        autoIncrement: true,
      })
      store.createIndex('pokemon_id', 'pokemon_id')
    }

    if (!db.objectStoreNames.contains(DB_TABLES.user_pokemons)) {
      const store = db.createObjectStore(DB_TABLES.user_pokemons, {
        keyPath: 'id',
        autoIncrement: true,
      })
      store.createIndex('pokemon_id', 'pokemon_id')
    }

    if (!db.objectStoreNames.contains(DB_TABLES.user_pokemon_moves)) {
      const store = db.createObjectStore(DB_TABLES.user_pokemon_moves, {
        keyPath: 'id',
        autoIncrement: true,
      })
      store.createIndex('user_pokemon_id', 'user_pokemon_id')
    }

    if (!db.objectStoreNames.contains(DB_TABLES.app_metadata)) {
      db.createObjectStore(DB_TABLES.app_metadata, { keyPath: 'key' })
    }
  },
})
