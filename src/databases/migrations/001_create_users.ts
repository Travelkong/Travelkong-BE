import fs from "node:fs"
import path from "node:path"
import type { Knex } from "knex"

import { externalSqlPath } from "~/configs/knex.config"

console.log("Yoshihide")
export async function up(knex: Knex): Promise<void> {
  const sql = fs.readFileSync(
    path.join(externalSqlPath, "/migrations/tables/users.sql"),
    "utf8",
  )

  console.log(sql)

  return knex.raw(sql)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users")
}
