import { Knex } from "knex";
import bcrypt from "bcrypt"

import { ROLE } from "~/miscs/others";
import { generateUserId } from "~/miscs/helpers/generateIds";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        {
            id: generateUserId(),
            username: "John",
            email: "johndoe@gmail.com",
            password: await bcrypt.hash('password', 10),
            profile_picture: null,
            role: ROLE.USER,
            address: null,
            created_at: knex.fn.now(),
            updated_at: null,
            deleted_at: null
        },
    ]);
};
