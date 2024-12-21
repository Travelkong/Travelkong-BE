import type { Response, NextFunction } from "express"
import type { AuthenticatedRequest } from "~/middlewares"
import type LikesResponse from "./likes.response"
import LikesService from "./likes.service"
import type { PostLikes } from "./interfaces/userLikes.interface"
import type { CommentLikes } from "./interfaces/commentLikes.interface"

class LikesController {
  readonly #likesService: LikesService

  constructor() {
    this.#likesService = new LikesService()
  }

  public getAll = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId: string | undefined = req.user?.userId
      if (!userId) {
        return res.status(401).json({ message: "No user ID provided." })
      }

      const result: LikesResponse | undefined = await this.#likesService.getAll(userId)
      if (result) {
        return res.status(result.statusCode).json({ message: result.message })
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error)
      }
    }
  }

  public addPostLike = async (
    req: AuthenticatedRequest & { body: PostLikes },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId: string | undefined = req.user?.userId
      if (!userId) {
        return res.status(401).json({ message: "No user ID provided." })
      }

      const payload: PostLikes = req.body
      if (!payload) {
          return res.status(400).json({ message: "Invalid input." })
      }

      //const error = this.#likesValidator.addPost
     } catch (error: unknown) {
      if (error instanceof Error) {
        next(error)
      }
    }
  }

  public remove = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {}
}

export default new LikesController()
