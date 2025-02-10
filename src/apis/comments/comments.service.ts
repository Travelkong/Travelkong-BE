import type { BaseResponse } from "~/miscs/others"
import type CommentsModel from "./comments.model"
import { generateId } from "~/miscs/helpers/generateIds"
import postgresqlConnection from "~/configs/postgresql.config"
import { Logger } from "~/miscs/logger"
import CommentsRepository from "./comments.repository"
import type CommentsResponse from "./comments.response"

export default class CommentsService {
  readonly #logger: Logger
  readonly #commentsRepository: CommentsRepository

  constructor() {
    this.#logger = new Logger()
    this.#commentsRepository = new CommentsRepository()
  }

  public get = async (id: string): Promise<CommentsResponse | undefined> => {
    try {
      const response = await this.#commentsRepository.get(id)
      if (response) {
        return {
          message: "Success",
          statusCode: 200,
          response: response
        }
      }

      return {
        message: "Comment not found",
        statusCode: 204
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }
    }
  }

  public add = async (
    userId: string,
    payload: CommentsModel,
  ): Promise<BaseResponse | undefined> => {
    try {
      // TODO: This needs fixing.
      const { parent_comment_id, post_id, comment, images } = payload

      const id: string = generateId()
      const queryString: string =
        "INSERT INTO comments (id, parent_comment_id, post_id, user_id, comment, images, status) VALUES ($1, $2, $3, $4, $5, $6, $7)"
      const result = await postgresqlConnection.query(queryString, [
        id,
        parent_comment_id,
        post_id,
        userId,
        comment,
        images,
        "created"
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
