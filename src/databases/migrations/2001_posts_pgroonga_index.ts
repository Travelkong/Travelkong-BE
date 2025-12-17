import fs from "node:fs"
import path from "node:path"
import type { Knex } from "knex"

import { externalSqlPath } from "~/configs"

export const config = {
  transaction: false,
}

export async function up(knex: Knex): Promise<void> {
  const sql = fs.readFileSync(
    path.join(externalSqlPath, "/migrations/indexes/pgroonga.sql"),
    "utf8",
  )

  await knex.raw(sql)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw("DROP INDEX IF EXISTS pgroonga_title_index")
}
