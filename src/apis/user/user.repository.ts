import postgresqlConnection from "~/configs/postgresql.config"
import { Logger } from "~/miscs/logger"
import type { UserModel } from "./user.model"
import type { UpdateUserDTO } from "./user.dto"

interface IUserRepository {
  findUser(userId: string): Promise<UserModel | undefined>
}

export default class UserRepository implements IUserRepository {
  readonly #logger: Logger

  constructor() {
    this.#logger = new Logger()
  }

  /**
   * Finds a user using their ID.
   * @param {string} userId
   * @returns {Promise<UserModel | undefined>}
   */
  public findUser = async (userId: string): Promise<UserModel | undefined> => {
    try {
      const response = await postgresqlConnection.query(
        "SELECT * FROM users WHERE id = $1 LIMIT 1",
        [userId],
      )
      return (response.rows[0] as UserModel[])[0] || undefined
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public getAll = async (): Promise<UserModel[] | undefined> => {
    try {
      const query: string = "SELECT * FROM users"
      const response = await postgresqlConnection.query(query)
      return response.rows as UserModel[]
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public update = async (
    id: string,
    fields: string,
    values: string[],
  ): Promise<UserModel | undefined> => {
    try {
      const query: string = `UPDATE users SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`
      const response = await postgresqlConnection.query(query, [id, ...values])

      return (response.rows[0] as UserModel) || undefined
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public delete = async (id: string): Promise<boolean | undefined> => {
    try {
      const query = "DELETE FROM users WHERE id = $1"
      const response = await postgresqlConnection.query(query, [id])

      return response?.rowCount === 1
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public isUserExisted = async (id: string): Promise<boolean | undefined> => {
    try {
      const query = "SELECT 1 FROM users WHERE id = $1"
      const response = await postgresqlConnection.query(query, [id])

      return response?.rowCount === 1
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public hasExisted = async (email: string): Promise<boolean | undefined> => {
    try {
      const query: string = "SELECT 1 FROM users WHERE email = $1"
      const response = await postgresqlConnection.query(query, [email])

      return response?.rowCount === 1
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }
}
