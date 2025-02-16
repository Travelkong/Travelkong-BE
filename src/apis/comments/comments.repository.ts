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
    id: string,
    postId: string,
    userId: string,
    comment: string,
    status: string,
    parentCommentId?: string,
    images?: string,
  ): Promise<boolean | undefined> => {
    try {
      const query: string =
        "INSERT INTO comments (id, parent_comment_id, post_id, user_id, comment, images, status) VALUES ($1, $2, $3, $4, $5, $6, $7)"
      const response = await postgresqlConnection.query(query, [
        id,
        parentCommentId,
        postId,
        userId,
        comment,
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

  public edit = async () => {
    try {
    } catch (error: unknown) {
      
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }
}
