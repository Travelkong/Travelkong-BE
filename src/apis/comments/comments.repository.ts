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
        "created",
      ])
      
      return response?.length === 0
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }
}
