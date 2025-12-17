import fs from "node:fs"
import path from "node:path"
import type { Knex } from "knex"

import { externalSqlPath } from "~/configs"

export async function up(knex: Knex): Promise<void> {
  const sql = fs.readFileSync(
    path.join(externalSqlPath, "/migrations/functions/tags_from_post.sql"),
    "utf8",
  )

  return knex.raw(sql)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw("DROP FUNCTION IF EXISTS tags_from_post(text)")
}
