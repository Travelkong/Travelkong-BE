import postgresqlConnection from '~/configs/postgresql.config';
import { Logger } from "~/miscs/logger"
import type CommentsModel from './comments.model';

export default class CommentsRepository {
  readonly #logger: Logger

  constructor() {
    this.#logger = new Logger()
  }

  public get = async (id: string): Promise<CommentsModel | undefined> => {
    try {
      const query = "SELECT * FROM comments WHERE id = $1"
      const [response] = await postgresqlConnection.query(query, [id])

      return response as CommentsModel
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }
}
