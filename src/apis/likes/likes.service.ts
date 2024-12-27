import { Logger } from "~/miscs/logger"
import LikesRepository from "./likes.repository"
import type LikesResponse from "./likes.response"
import type LikesModel from "./likes.model"
import type { PostLikes } from "./interfaces/postLikes.interface"
import type { CommentLikes } from "./interfaces/commentLikes.interface"

interface ILikesService {
  getAll(userId: string): Promise<LikesResponse | undefined>
  addPostLike(
    payload: PostLikes,
    userId: string,
  ): Promise<LikesResponse | undefined>
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

  private readonly isLikeExists = async ({
    userId,
    postId,
    commentId,
  }: {
    userId: string
    postId?: string
    commentId?: string
  }): Promise<boolean | undefined> => {
    let likeExists: number | undefined
    if (postId) {
      likeExists = await this.#likesRepository.findPostLike(postId, userId)
    }

    if (commentId) {
      likeExists = await this.#likesRepository.findCommentLike(
        commentId,
        userId,
      )
    }

    if (likeExists === 1) {
      return true
    }

    return false
  }
}

export default LikesService
