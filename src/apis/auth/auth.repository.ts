import postgresqlConnection from "~/configs/postgresql.config"
import { Logger } from "winston"
import type { UserModel } from "../user/user.model"

export default class AuthRepository {
  readonly #logger: Logger

  constructor() {
    this.#logger = new Logger()
  }

  public register = async (
    userId: string,
    username: string,
    email: string,
    password: string,
    role: string,
  ): Promise<boolean | undefined> => {
    try {
      const query: string =
        "INSERT INTO users (id, username, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING username, email"
      const response = await postgresqlConnection.query(query, [
        userId,
        username,
        email,
        password,
        role,
      ])

      return response.rows[0]?.length === 1
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public login = async (
    identifier: string
  ): Promise<UserModel | undefined> => {
    try {
      const query = "SELECT * FROM users WHERE (username = $1 OR email = $1) LIMIT 1"
      const response = await postgresqlConnection.query(query, [identifier])

      return response.rows[0] as UserModel
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }
}
