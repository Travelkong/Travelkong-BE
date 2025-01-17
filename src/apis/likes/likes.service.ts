import { Logger } from "~/miscs/logger"
import LikesRepository from "./likes.repository"
import type LikesResponse from "./likes.response"
import type LikesModel from "./likes.model"
import type { PostLikes } from "./interfaces/postLikes.interface"
import type { CommentLikes } from "./interfaces/commentLikes.interface"
import type { BaseResponse } from "~/miscs/others"

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
        throw error
      }
    }
  }

  public addPostLike = async (
    payload: PostLikes,
    userId: string,
  ): Promise<LikesResponse | undefined> => {
    try {
      const postId: string = payload.postId
      const isExisted: boolean | undefined = await this.isLikeExists({
        userId: userId,
        postId: postId,
      })
      if (isExisted) {
        return {
          // https://stackoverflow.com/questions/3825990/http-response-code-for-post-when-resource-already-exists
          statusCode: 409,
          total: 0,
          message: "You have liked this post.",
        }
      }

      const response: boolean | undefined =
        await this.#likesRepository.addPostLike(postId, userId)
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

  public addCommentLike = async (
    payload: CommentLikes,
    userId: string,
  ): Promise<LikesResponse | undefined> => {
    try {
      const commentId: string = payload.commentId
      const isExisted: boolean | undefined = await this.isLikeExists({
        userId: userId,
        commentId: commentId,
      })
      if (isExisted) {
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
      const isExisted: boolean | undefined = await this.isLikeExists({
        id: id,
      })

      if (!isExisted) {
        return {
          statusCode: 404,
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

      return {
        error: true,
        statusCode: 410,
        message: "Cannot delete like",
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }
    }
  }

  public removeCommentLike = async (
    id: string,
  ): Promise<BaseResponse | undefined> => {
    try {
      const isExisted: boolean | undefined = await this.isLikeExists({
        id: id,
      })

      if (!isExisted) {
        return {
          statusCode: 404,
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

      return {
        error: true,
        statusCode: 410,
        message: "Cannot delete like",
      }
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
