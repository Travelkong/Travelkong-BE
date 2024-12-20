import postgresqlConnection from "~/configs/postgresql.config"
import { Logger } from "~/miscs/logger"
import type { UserModel } from "./user.model"
import type { QueryResultRow } from "pg"

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
        throw error
      }
    }
  }
}
