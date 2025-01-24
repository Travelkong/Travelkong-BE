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
      const query: string = "SELECT name FROM tags"
      const result = await postgresqlConnection.query(query)

      if (result) {
        return result as TagsModel[]
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }
    }
  }

  public find = async (name: string): Promise<boolean | undefined> => {
    // Checks whether a tag exists in the database.
    try {
      const query: string = "SELECT name FROM tags WHERE name = $1"
      const result = await postgresqlConnection.query(query, [name])

      if (result.length) {
        return true
      }

      return false
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }
    }
  }

  public add = async (
    id: string,
    name: string,
  ): Promise<boolean | undefined> => {
    try {
      const query: string = "INSERT INTO tags (id, name) VALUES ($1, $2)"
      const result = await postgresqlConnection.query(query, [id, name])

      return result?.length === 1
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
        throw error
      }
    }
  }

  public update = async (
    id: string,
    name: string,
  ): Promise<boolean | undefined> => {
    try {
      const query: string =
        "UPDATE tags SET name = $2 WHERE id = $1 RETURNING *"
      const result = await postgresqlConnection.query(query, [id, name])
      return result?.length === 1
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
        throw error
      }
    }
  }

  public delete = async (id: string): Promise<boolean | undefined> => {
    try {
      const query: string = "DELETE FROM tags WHERE id = $1"
      const result = await postgresqlConnection.query(query, [id]) // Returns an empty array upon success.

      return result?.length === 1
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
        throw error
      }
    }
  }

  public isTagsExisted = async ({
    id,
    name,
  }: {
    id?: string
    name?: string
  }): Promise<boolean | undefined> => {
    try {
      const query: string = "SELECT 1 FROM tags WHERE id = $1 OR name = $2"
      const result = await postgresqlConnection.query(query, [id, name])

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
