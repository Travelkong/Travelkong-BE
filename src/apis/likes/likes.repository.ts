import postgresqlConnection from "~/configs/postgresql.config"
import { Logger } from "~/miscs/logger"
import type LikesModel from "./likes.model"
import type { QueryResultRow } from "pg"

interface ILikesRepository {
  getAll(userId: string): Promise<LikesModel[] | undefined>
}

export default class LikesRepository implements ILikesRepository {
  readonly #logger: Logger

  constructor() {
    this.#logger = new Logger()
  }

  public getAll = async (userId: string): Promise<LikesModel[] | undefined> => {
    try {
      const queryString: string =
        "SELECT id, post_id, user_id, created_at, updated_at FROM post_likes WHERE user_id = $1"
      const response: QueryResultRow[] = await postgresqlConnection.query(
        queryString,
        [userId],
      )

      if (response) {
        return response as LikesModel[]
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }
    }
  }
}
