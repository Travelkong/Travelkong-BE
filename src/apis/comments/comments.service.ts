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
          response: response,
        }
      }

      return {
        message: "Comment not found",
        statusCode: 204,
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
      const { parentCommentId, postId, comment, images } = payload
      const imagesUrl = JSON.stringify(images)

      const id: string = generateId()
      const response: boolean | undefined = await this.#commentsRepository.add(
        id,
        postId,
        userId,
        comment,
        parentCommentId,
        imagesUrl,
      )

      if (response) {
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
