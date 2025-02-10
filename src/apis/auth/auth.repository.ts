import postgresqlConnection from '~/configs/postgresql.config';
import { Logger } from "winston"

export default class AuthRepository {
  readonly #logger: Logger

  constructor() {
    this.#logger = new Logger()
  }

  public isExisted = async (
    email: string
  ): Promise<boolean | undefined> => {
    try {
      const query: string = "SELECT 1 FROM users WHERE email = $1"
      const response = await postgresqlConnection.query(query, [
        email,
      ])

      return response?.length === 1
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }
}
