import { Logger } from "~/miscs/logger"
import LikesRepository from "./likes.repository"
import type LikesResponse from "./likes.response"
import type LikesModel from "./likes.model"

interface ILikesService {
  getAll(userId: string): Promise<LikesResponse | undefined>
  addPostLikes(userId: string): Promise<LikesResponse | undefined>
  addCommentLikes(userId: string): Promise<LikesResponse | undefined>
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
      let total = 0

      const responses: LikesModel[] | undefined = await this.#likesRepository.getAll(userId)
      if (!Array.isArray(responses)) {
        return
      }

      total = responses.length
      if (responses) {
        return {
          message: "All likes",
          statusCode: 200,
          total: total,
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

  public addpostLikes = async (userId: string): Promise<LikesResponse | undefined> => {
    try {
      
    }
  }

  public addCommentLikes(userId: string): Promise<LikesResponse | undefined> {
    throw new Error("Method not implemented.")
  }
}

export default LikesService
