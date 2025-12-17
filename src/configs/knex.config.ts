import type { Knex } from "knex"
import fs from "node:fs"
import * as path from "node:path"

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
    extension: "ts",
    loadExtensions: [".ts"],
  },

  seeds: {
    directory: path.join(databasePath, "seeds"),
    extension: "ts",
    loadExtensions: [".ts"],
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
