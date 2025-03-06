import postgresqlConnection from "~/configs/postgresql.config"
import { Logger } from "~/miscs/logger"
import type CommentsModel from "./comments.model"

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

  public add = async (
    payload: CommentsModel
  ): Promise<boolean | undefined> => {
    const { id, parentCommentId, postId, userId, comment, images, level, status } = payload
    try {
      const query: string =
        "INSERT INTO comments (id, parent_comment_id, post_id, user_id, comment, level, images, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"
      const response = await postgresqlConnection.query(query, [
        id,
        parentCommentId,
        postId,
        userId,
        comment,
        level,
        images,
        status,
      ])

      return response?.length === 0
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public edit = async (
    id: string,
    comment: string,
    images: string,
    status: string,
  ): Promise<boolean | undefined> => {
    try {
      const query =
        "UPDATE comments SET comment = $1, images = $2, status = $3 WHERE id = $4 RETURNING *"
      const response = await postgresqlConnection.query(query, [
        comment,
        images,
        status,
        id,
      ])

      return response?.length === 1
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public adminDelete = async (id: string): Promise<boolean | undefined> => {
    try {
      const query = "DELETE FROM comments WHERE id = $1"
      const result = await postgresqlConnection.query(query, [id])

      return result?.length === 1
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public delete = async (
    id: string,
    status: string,
  ): Promise<boolean | undefined> => {
    try {
      const query = "UPDATE comments SET status = $2 WHERE id = $1 RETURNING 1"
      const result = await postgresqlConnection.query(query, [id, status])
      return result?.length === 1
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public getCommentLevel = async (id: string): Promise<number> => {
    try {
      const query = "SELECT level FROM comments WHERE id = $1"
      const [response] = await postgresqlConnection.query(query, [id])

      if (typeof(response.level) === "number") return +response.level
      throw new Error("Internal server error")
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public hasCommentExisted = async (
    id: string,
  ): Promise<boolean | undefined> => {
    try {
      const query = "SELECT 1 FROM comments WHERE id = $1"
      const result = await postgresqlConnection.query(query, [id])

      if (result.length === 1) {
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

  public isSameUser = async (
    userId: string,
    id: string,
  ): Promise<boolean | undefined> => {
    try {
      const query = "SELECT 1 FROM comments WHERE id = $1 AND user_id = $2"
      const response = await postgresqlConnection.query(query, [id, userId])

      return response?.length === 1
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }
}
