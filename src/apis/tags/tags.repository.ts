import postgresqlConnection from "~/configs/postgresql.config"
import { Logger } from "~/miscs/logger"
import type TagsModel from "./tags.model"

export default class TagsRepository {
  readonly #logger: Logger

  constructor() {
    this.#logger = new Logger()
  }

  public getAll = async (): Promise<TagsModel[] | undefined> => {
    try {
      const queryString: string = "SELECT name FROM tags"
      const result = await postgresqlConnection.query(queryString)

      if (result) {
        return result as TagsModel[]
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }
    }
  }

  public find = async (): Promise<string | undefined> => {}
}
