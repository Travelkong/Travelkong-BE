import postgresqlConnection from "~/configs/postgresql.config"
import { Logger } from "~/miscs/logger"
import type TagsModel from "./tags.model"
import { generateId } from "~/miscs/helpers"

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

  // public find = async (): Promise<string | undefined> => {  }

  public add = async (name: string): Promise<boolean | undefined> => {
    try {
      const id: string | undefined = generateId()
      if (!id) {
        throw new Error("Internal server error.")
      }

      const queryString = "INSERT INTO tags (id, name) VALUES ($1, $2)"
      const result = await postgresqlConnection.query(queryString, [id, name])

      return result?.length === 1
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
        throw error
      }
    }
  }

  public isTagsExisted = async (name: string): Promise<boolean | undefined> => {
    try {
      const query = "SELECT 1 FROM tags WHERE name = $1"
      const result = await postgresqlConnection.query(query, [name])
      if (result.length === 1) {
        return true
      }

      return false
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
        throw error
      }
    }
  }
}
