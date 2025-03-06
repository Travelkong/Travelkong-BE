import type { BaseResponse } from "~/miscs/others"
import type CommentsModel from "./comments.model"
import { generateId } from "~/miscs/helpers/generateIds"
import { Logger } from "~/miscs/logger"
import CommentsRepository from "./comments.repository"
import type CommentsResponse from "./comments.response"
import type { UpdateCommentDTO } from "./comments.dto"

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
      payload.id = generateId()
      payload.userId = userId
      payload.status = "created"
      payload.images = JSON.stringify(payload.images)

      // Checks comment level (the hierarchy comments (I have no idea what it is called
      // nor how to explain it, but it is kinda like what reddit does), maximum 5).
      if (!payload.parentCommentId) {
        payload.level = 0
        payload.parentCommentId = null
      } else {
        const parentCommentLevel =
          await this.#commentsRepository.getCommentLevel(
            payload.parentCommentId,
          )

        payload.level = parentCommentLevel + 1
      }

      if (payload.level > 5) {
        payload.level = 5
      }

      const response: boolean | undefined = await this.#commentsRepository.add(
        payload,
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
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public edit = async (
    userId: string,
    payload: UpdateCommentDTO,
  ): Promise<BaseResponse | undefined> => {
    try {
      const { id, comment, images } = payload
      const imagesUrl = JSON.stringify(images)
      const status = "updated"

      const sameUser = await this.#commentsRepository.isSameUser(userId, id)
      if (!sameUser) {
        return {
          statusCode: 403,
          message: "Cannot edit other users' comments.",
        }
      }

      const response = await this.#commentsRepository.edit(
        id,
        comment,
        imagesUrl,
        status,
      )
      if (response) {
        return {
          statusCode: 200,
          message: "Comment updated.",
        }
      }

      return {
        statusCode: 500,
        message: "Internal server error.",
      }
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public delete = async (
    id: string,
    isAdmin?: boolean,
  ): Promise<BaseResponse | undefined> => {
    let response: boolean | undefined
    try {
      const isExisted = await this.#commentsRepository.hasCommentExisted(id)
      if (!isExisted) {
        return {
          statusCode: 204,
          message: "No comment.",
        }
      }

      if (isAdmin === true) {
        response = await this.#commentsRepository.adminDelete(id)
      } else {
        const status = "deleted"
        response = await this.#commentsRepository.delete(id, status)
      }

      if (response) {
        return {
          statusCode: 200,
          message: "Comment deleted.",
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
