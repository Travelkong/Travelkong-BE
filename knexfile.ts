import type { Knex } from "knex";
require("dotenv").config()

// This file used for Knex.js configuration
// and for Knex CLI Command (migrations and seeders in this case)

const config: { [key: string]: Knex.Config } = {
  development: {
    client: process.env.DB_CLIENT,
    connection: {
      connectionString: process.env.POSTGRESQL_URL,
      // host: process.env.DB_HOST,
      // port: process.env.DB_POST,
      // user: process.env.DB_USER,
      // password: process.env.DB_PASSWORD,
      // database: process.env.DB_NAME,
    },
    migrations: {
      directory: "./src/databases/migrations",
      tableName: "knex_migrations"
    },
    seeds: {
      directory: "./src/databases/seeds",
    },
    pool: {
      min: 2,
      max: 20
    }
  },

  // production: {
  //   client: "postgresql",
  //   connection: {
  //     database: "my_db",
  //     user: "username",
  //     password: "password"
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: "knex_migrations"
  //   }
  // }

};

export default config;
