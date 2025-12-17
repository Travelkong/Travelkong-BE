import fs from "node:fs"
import path from "node:path"
import type { Knex } from "knex"

import { externalSqlPath } from "~/configs"

export async function up(knex: Knex): Promise<void> {
  console.log("Apollo")
  const sql = fs.readFileSync(
    path.join(externalSqlPath, "/migrations/functions/remove_post_tags.sql"),
    "utf8",
  )

  return knex.raw(sql)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw("DROP FUNCTION IF EXISTS remove_post_tags(text, text)")
}
