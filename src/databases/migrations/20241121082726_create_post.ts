import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("posts", (table) => {
        table.increments("id", { primaryKey: true }).unique().notNullable()
        table.uuid("user_id").notNullable()
        table.integer("post_content_id")
        table.boolean("liked").defaultTo(false).nullable()
        table.integer("likes_count").defaultTo(0).nullable()
        table.integer("comments_count").defaultTo(0).nullable()
        table.integer("views_count").defaultTo(0).nullable()
        table.timestamp("created_at", { useTz: true }).nullable()
        table.timestamp("updated_at", { useTz: true }).nullable()
    })

    await knex.schema.createTable("post_contents", (table) => {
        table.increments("id", { primaryKey: true }).unique().notNullable()
        table.string("title", 200).notNullable()
        table.text("cover_image_url").notNullable()
        table.text("body").notNullable()
        table.jsonb("images").nullable()
        table.jsonb("tags").nullable()
        table.timestamp("created_at", { useTz: true }).nullable()
        table.timestamp("updated_at", { useTz: true }).nullable()
    })

    await knex.schema.createTable("comments", (table) => {
        table.increments("id", { primaryKey: true }).unique().notNullable()
        table.integer("parent_comment_id").nullable()
        table.integer("post_id").notNullable()
        table.uuid("user_id").notNullable()
        table.string("username", 100).nullable()
        table.text("comment").nullable()
        table.jsonb("images").nullable()
        table.timestamp("created_at", { useTz: true }).nullable()
        table.timestamp("updated_at", { useTz: true }).nullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("posts")
    await knex.schema.dropTable("post_comments")
    await knex.schema.dropTable("comments")
}

