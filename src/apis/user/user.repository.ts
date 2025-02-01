import postgresqlConnection from "~/configs/postgresql.config"
import { Logger } from "~/miscs/logger"
import type { UserModel } from "./user.model"
import type { QueryResultRow } from "pg"
import type { UpdateUserDTO } from "./user.dto"

interface IUserRepository {
  findUser(userId: string): Promise<UserModel | undefined>
}

export default class UserRepository implements IUserRepository {
  readonly #logger: Logger

  constructor() {
    this.#logger = new Logger()
  }

  public findUser = async (userId: string): Promise<UserModel | undefined> => {
    try {
      const response: QueryResultRow[] = await postgresqlConnection.query(
        "SELECT * FROM users WHERE id = $1 LIMIT 1", [userId]
      )
      return (response as UserModel[])[0]
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

      return response as UserModel[]
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
    }

  public update = async (payload: UpdateUserDTO): Promise<UserModel | undefined> => {
    try {
      const query: string = "UPDATE users "

      return
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
      const result = await postgresqlConnection.query(query, [id])

      return result?.length === 1
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
      const result = await postgresqlConnection.query(query, [id])

      return result?.length === 1
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }
}
