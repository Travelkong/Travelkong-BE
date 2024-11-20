import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").notNullable()
    table.string("username", 100).notNullable()
    table.string("email", 100).notNullable()
    table.text("password").notNullable()
    table.text("profile_picture").nullable()
    table.string("role", 10).nullable()
    table.string("address", 300).nullable()
    table.timestamp("created_at", { useTz: true }).nullable()
    table.timestamp("updated_at", { useTz: false }).nullable()
    table.timestamp("deleted_at", { useTz: true })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users")
}
