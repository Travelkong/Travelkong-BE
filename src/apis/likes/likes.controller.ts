import type { Response, NextFunction } from "express"
import type { AuthenticatedRequest } from "~/middlewares"
import LikesService from "./likes.service"

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

      const result = await this.#likesService.getAll(userId)
      return res.status(result.statusCode).json({ message: result.message })
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error)
      }
    }
  }

  public add = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {}

  public remove = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {}
}

export default new LikesController()
