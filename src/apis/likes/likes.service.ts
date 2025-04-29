import { Logger } from "~/miscs/logger"
import LikesRepository from "./likes.repository"
import type LikesResponse from "./likes.response"
import type LikesModel from "./likes.model"
import type { PostLikes } from "./interfaces/postLikes.interface"
import type { CommentLikes } from "./interfaces/commentLikes.interface"
import { CustomError, type BaseResponse } from "~/miscs/others"
import { HTTP_STATUS } from "~/miscs/utils"

interface ILikesService {
  getAll(userId: string): Promise<LikesResponse | undefined>
  addPostLike(
    payload: PostLikes,
    userId: string,
  ): Promise<LikesResponse | undefined>
  addCommentLike(
    payload: CommentLikes,
    userId: string,
  ): Promise<LikesResponse | undefined>
  removePostLike(id: string, userId: string): Promise<BaseResponse | undefined>
  removeCommentLike(
    id: string,
    userId: string,
  ): Promise<BaseResponse | undefined>
}

class LikesService implements ILikesService {
  readonly #logger: Logger
  readonly #likesRepository: LikesRepository

  constructor() {
    this.#logger = new Logger()
    this.#likesRepository = new LikesRepository()
  }

  public getAll = async (
    userId: string,
  ): Promise<LikesResponse | undefined> => {
    try {
      const responses: LikesModel[] | undefined =
        await this.#likesRepository.getAll(userId)
      if (!Array.isArray(responses)) {
        return
      }

      const total = responses.length
      if (responses) {
        return {
          statusCode: 200,
          total: total ?? 0,
          response: responses,
          message: "Success",
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public getPostLikes = async (
    id: string,
  ): Promise<LikesResponse | undefined> => {
    try {
      const response = await this.#likesRepository.getPostLikes(id)
      if (response) {
        return {
          total: response.length,
          statusCode: 200,
          message: "All likes from this post.",
          response: response,
        }
      }

      return {
        total: 0,
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

  public getCommentLikes = async (
    id: string,
  ): Promise<LikesResponse | undefined> => {
    try {
      const response = await this.#likesRepository.getCommentLikes(id)
      if (response) {
        return {
          total: response.length,
          statusCode: 200,
          message: "All likes from this comment.",
          response: response,
        }
      }

      return {
        total: 0,
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

  public isPostLiked = async (
    userId: string,
    id: string,
  ): Promise<BaseResponse | undefined> => {
    try {
      const isLiked = await this.isLikeExists({ postId: id, userId: userId })
      if (!isLiked) {
        return {
          statusCode: 204,
          message: "You haven't liked this post.",
        }
      }

      return {
        statusCode: 200,
        message: "You have liked this post.",
      }
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public isCommentLiked = async (
    userId: string,
    id: string,
  ): Promise<BaseResponse | undefined> => {
    try {
      const isLiked = await this.isLikeExists({ commentId: id, userId: userId })
      if (!isLiked) {
        return {
          statusCode: 204,
          message: "You haven't liked this comment.",
        }
      }

      return {
        statusCode: 200,
        message: "You have liked this comment.",
      }
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public addPostLike = async (
    payload: PostLikes,
    userId: string,
  ): Promise<LikesResponse | undefined> => {
    try {
      const postId: string = payload.postId
      const isLiked: boolean | undefined = await this.isLikeExists({
        userId: userId,
        postId: postId,
      })
      if (isLiked) {
        return {
          // https://stackoverflow.com/questions/3825990/http-response-code-for-post-when-resource-already-exists
          total: 0,
          statusCode: HTTP_STATUS.CONFLICT.code,
          message: HTTP_STATUS.CONFLICT.message,
        }
      }

      const response: boolean | undefined =
        await this.#likesRepository.addPostLike(postId, userId)
      if (response === false) {
        return {
          total: 0,
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
        }
      }

      return {
        total: 1,
        statusCode: HTTP_STATUS.CREATED.code,
        message: HTTP_STATUS.CREATED.message,
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public addCommentLike = async (
    payload: CommentLikes,
    userId: string,
  ): Promise<LikesResponse | undefined> => {
    try {
      const commentId: string = payload.commentId
      const isLiked: boolean | undefined = await this.isLikeExists({
        userId: userId,
        commentId: commentId,
      })
      if (isLiked) {
        return {
          statusCode: 409, // Conflict
          total: 0,
          message: "You have liked this comment.",
        }
      }

      const response: boolean | undefined =
        await this.#likesRepository.addCommentLike(commentId, userId)
      if (response === false) {
        return {
          total: 1,
          statusCode: 201,
          message: "Like added.",
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public removePostLike = async (
    id: string,
  ): Promise<BaseResponse | undefined> => {
    try {
      const isLiked: boolean | undefined = await this.isLikeExists({
        id: id,
      })

      if (!isLiked) {
        return {
          statusCode: 204,
          message: "You haven't liked this post.",
        }
      }

      const isDeleted: boolean | undefined =
        await this.#likesRepository.removePostLike(id)
      if (!isDeleted) {
        return {
          statusCode: 200,
          message: "Deleted!",
        }
      }

      throw new CustomError(410, "Cannot delete like")
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public removeCommentLike = async (
    id: string,
  ): Promise<BaseResponse | undefined> => {
    try {
      const isLiked: boolean | undefined = await this.isLikeExists({
        id: id,
      })

      if (!isLiked) {
        return {
          statusCode: 204,
          message: "You haven't liked this comment.",
        }
      }

      const isDeleted: boolean | undefined =
        await this.#likesRepository.removeCommentLike(id)
      if (!isDeleted) {
        return {
          statusCode: 200,
          message: "Deleted!",
        }
      }

      throw new CustomError(410, "Cannot delete like")
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }
    }
  }

  private readonly isLikeExists = async ({
    id,
    userId,
    postId,
    commentId,
  }: {
    id?: string
    userId?: string
    postId?: string
    commentId?: string
  }): Promise<boolean | undefined> => {
    let likeExists: number | undefined

    if (id) {
      likeExists = await this.#likesRepository.isExists({ id: id })
    } else if (postId) {
      likeExists = await this.#likesRepository.isExists({
        postId: postId,
        userId: userId,
      })
    } else if (commentId) {
      likeExists = await this.#likesRepository.isExists({
        commentId: commentId,
        userId: userId,
      })
    }

    if (likeExists === 1) {
      return true
    }

    return false
  }
}

export default LikesService
