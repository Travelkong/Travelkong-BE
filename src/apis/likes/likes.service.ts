import { Logger } from "~/miscs/logger"
import LikesRepository from "./likes.repository"
import type LikesResponse from "./likes.response"
import type LikesModel from "./likes.model"
import type { PostLikes } from "./interfaces/postLikes.interface"
import type { CommentLikes } from "./interfaces/commentLikes.interface"

interface ILikesService {
  getAll(userId: string): Promise<LikesResponse | undefined>
  addPostLike(payload: PostLikes, userId: string): Promise<LikesResponse | undefined>
  addCommentLike(userId: string): Promise<LikesResponse | undefined>
}

class LikesService implements ILikesService {
  readonly #logger: Logger
  readonly #likesRepository: LikesRepository

  constructor() {
    this.#logger = new Logger()
    this.#likesRepository = new LikesRepository()
  }

  public getAll = async (userId: string): Promise<LikesResponse | undefined> => {
    try {
      const responses: LikesModel[] | undefined = await this.#likesRepository.getAll(userId)
      if (!Array.isArray(responses)) {
        return
      }

      const total = responses.length
      if (responses) {
        return {
          message: "All likes",
          statusCode: 200,
          total: total ?? 0,
          response: responses
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
        throw error
      }
    }
  }

  private isLikeExists = async (id: string): boolean => {
    const likeExists: LikesModel = await this.#likesRepository.find(payload)
  }

  public addPostLike = async (payload: PostLikes, userId: string): Promise<LikesResponse | undefined> => {
    try {
      const isExisted: boolean = await this.isLikeExists(payload)
      if (isExisted) {

      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }
    }
  }

  public addCommentLike(userId: string): Promise<LikesResponse | undefined> {
    throw new Error("Method not implemented.")
  }
}

export default LikesService
