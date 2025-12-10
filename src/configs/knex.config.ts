import path from "node:path"
import type { Knex } from "knex"

import EnvConfig from "~/configs/env.config"

const databasePath = path.resolve(__dirname, "../databases")
console.log("Database path: ", databasePath)
const externalSqlPath = path.resolve(__dirname, EnvConfig.insert.externalSqlPath)
console.log(externalSqlPath)

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      connectionString: EnvConfig.database.postgresqlUrl,
    },

    migrations: {
      directory: `${databasePath}/migrations`,
      tableName: "knex_migrations",
      extension: "sql",
      loadExtensions: [".sql"],
    },

    seeds: {
      directory: `${databasePath}/seeds`,
      extension: "sql",
      loadExtensions: [".sql"],
    },

    pool: {
      min: 2,
      max: 20,
    },
  },
}

export default config
export { externalSqlPath }