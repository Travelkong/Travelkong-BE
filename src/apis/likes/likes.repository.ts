import postgresqlConnection from "~/configs/postgresql.config"
import { Logger } from "~/miscs/logger"
import type LikesModel from "./likes.model"
import type { QueryResultRow } from "pg"

interface ILikesRepository {
  getAll(userId: string): Promise<LikesModel[]>
}

export default class LikesRepository implements ILikesRepository {
  readonly #logger: Logger

  constructor() {
    this.#logger = new Logger()
  }

  public getAll = async (userId: string): Promise<LikesModel[]> => {
    try {
      const queryString: string = "SELECT"
      const response: QueryResultRow[] = await postgresqlConnection.query()
    }
  }
}
