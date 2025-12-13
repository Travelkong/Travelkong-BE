import * as path from "node:path"
import type { Knex } from "knex"

import EnvConfig from "~/configs/env.config"

const databasePath = path.resolve(__dirname, "../databases")
const externalSqlPath = path.resolve(
  __dirname,
  EnvConfig.insert.externalSqlPath,
)

const developmentConfig: Knex.Config = {
  client: "pg",
  connection: {
    connectionString: EnvConfig.database.postgresqlUrl,
  },

  migrations: {
    directory: path.join(databasePath, "migrations"),
    tableName: "knex_migrations",
    extension: "sql",
    loadExtensions: [".sql"],
  },

  seeds: {
    directory: path.join(databasePath, "seeds"),
    extension: "sql",
    loadExtensions: [".sql"],
  },

  pool: {
    min: 2,
    max: 20,
  },
}

const config: { [key: string]: Knex.Config } = {
  development: developmentConfig,
}

export default config
export { externalSqlPath }
