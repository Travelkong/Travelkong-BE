import fs from "node:fs"
import path from "node:path"
import type { Knex } from "knex"

import { externalSqlPath } from "~/configs"

export async function up(knex: Knex): Promise<void> {
  console.log("Apollo")
  const sql = fs.readFileSync(
    path.join(externalSqlPath, "/migrations/functions/refresh_tokens/set_expires_at.sql"),
    "utf8",
  )

  await knex.raw(sql)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw("DROP FUNCTION IF EXISTS set_expires_at()")
}
