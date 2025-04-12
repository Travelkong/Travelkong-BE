import postgresqlConnection from "~/configs/postgresql.config"
import { Logger } from "~/miscs/logger"
import type TagsModel from "./tags.model"
import { BaseResponse } from "~/miscs/others"

export default class TagsRepository {
  readonly #logger: Logger

  constructor() {
    this.#logger = new Logger()
  }

  public getAll = async (): Promise<TagsModel[] | undefined> => {
    try {
      const query: string = "SELECT name FROM tags"
      const response = await postgresqlConnection.query(query)

      return response.rows[0] as TagsModel[] ?? undefined
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public findByName = async (name: string): Promise<TagsModel | undefined> => {
    // Checks whether a tag exists in the database.
    try {
      const query: string = "SELECT id, name FROM tags WHERE name = $1"
      const response = await postgresqlConnection.query(query, [name])

      return response.rows[0] as TagsModel ?? undefined
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  /**
   * Get all tags in a post.
   * @param {string} postId
   * @returns {Promise<BaseResponse | undefined>}
   */
  public getPostTags = async (postId: string): Promise<string[] | undefined> => {
    try {
      const query = "SELECT * FROM post_tags WHERE post_id = $1"
      const response = await postgresqlConnection.query(query, [postId])
      return response?.rows[0] as string[]
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public add = async (
    id: string,
    name: string,
  ): Promise<boolean | undefined> => {
    try {
      const query: string = "INSERT INTO tags (id, name) VALUES ($1, $2)"
      const response = await postgresqlConnection.query(query, [id, name])

      return response?.rowCount === 1
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public update = async (
    id: string,
    name: string,
  ): Promise<boolean | undefined> => {
    try {
      const query: string =
        "UPDATE tags SET name = $2 WHERE id = $1 RETURNING *"
      const response = await postgresqlConnection.query(query, [id, name])
      return response?.rowCount === 1
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public delete = async (id: string): Promise<boolean | undefined> => {
    try {
      const query: string = "DELETE FROM tags WHERE id = $1"
      const response = await postgresqlConnection.query(query, [id]) // Returns an empty array upon success.

      return response?.rowCount === 1
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
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
      const response = await postgresqlConnection.query(query, [id, name])

      if (response?.rowCount === 1) {
        return true
      }

      return false
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }
}
