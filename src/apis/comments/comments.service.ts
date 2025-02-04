import type { BaseResponse } from "~/miscs/others"
import type { CommentModel } from "./comments.model"
import { generateId } from "~/miscs/helpers/generateIds"
import postgresqlConnection from "~/configs/postgresql.config"
import { Logger } from "~/miscs/logger"

export default class CommentsService {
  readonly #logger: Logger

  constructor() {
    this.#logger = new Logger()
  }

  public get = async (id: string) => {}

  public add = async (
    userId: string,
    payload: CommentModel,
  ): Promise<BaseResponse | undefined> => {
    try {
      const { parent_comment_id, post_id, comment, images } = payload

      const id: string = generateId()
      const queryString: string =
        "INSERT INTO comments (id, parent_comment_id, post_id, user_id, comment, images) VALUES ($1, $2, $3, $4, $5, $6)"
      const result = await postgresqlConnection.query(queryString, [
        id,
        parent_comment_id || null,
        post_id,
        userId,
        comment,
        images || null,
      ])

      if (!result.length) {
        return {
          statusCode: 201,
          message: "Comment created",
        }
      }
      return {
        error: true,
        statusCode: 500,
        message: "Internal server error",
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }
}
