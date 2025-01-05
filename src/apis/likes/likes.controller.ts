import LikesService from "./likes.service"
import LikesValidator from "./likes.validator"
import type { CommentLikes } from "./interfaces/commentLikes.interface"
import type { Response, NextFunction } from "express"
import type { AuthenticatedRequest } from "~/middlewares"
import type LikesResponse from "./likes.response"
import type { PostLikes } from "./interfaces/postLikes.interface"

class LikesController {
  readonly #likesService: LikesService
  readonly #likesValidator: LikesValidator

  constructor() {
    this.#likesService = new LikesService()
    this.#likesValidator = new LikesValidator()
  }

  public getAll = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const userId: string | undefined = req.user?.userId
      if (!userId) {
        return res.status(401).json({ message: "No user ID provided." })
      }

      const result: LikesResponse | undefined = await this.#likesService.getAll(
        userId,
      )
      if (result) {
        return res.status(result?.statusCode).json({
          message: result?.message,
          total: result?.total,
          response: result?.response,
        })
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
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const userId: string | undefined = req.user?.userId
      if (!userId) {
        return res.status(401).json({ message: "No user ID provided." })
      }

      const payload: PostLikes = req.body
      if (!payload) {
        return res.status(400).json({ message: "Invalid input." })
      }

      const validationError = this.#likesValidator.validatePostLike(payload)
      if (validationError) {
        return res.status(400).json({ message: validationError })
      }

      const response = await this.#likesService.addPostLike(payload, userId)
      if (response) {
        return res
          .status(response?.statusCode)
          .json({ message: response?.message })
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error)
      }
    }
  }

  // TODO: prolly merge these two functions (and all the subsequent ones) since they are pretty similar.
  public addCommentLike = async (
    req: AuthenticatedRequest & { body: CommentLikes },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const userId: string | undefined = req.user?.userId
      if (!userId) {
        return res.status(401).json({ message: "No user ID provided." })
      }

      const payload: CommentLikes = req.body
      if (!payload) {
        return res.status(400).json({ message: "Invalid input." })
      }

      const validatiionError = this.#likesValidator.validateCommentLike(payload)
      if (validatiionError) {
        return res.status(400).json({ validatiionError })
      }

      const response = await this.#likesService.addCommentLike(payload, userId)
      if (response) {
        return res
          .status(response?.statusCode)
          .json({ message: response?.message })
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error)
      }
    }
  }

  public removePostLike = async (
    req: AuthenticatedRequest & { body: string },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const payload: string = req?.body?.id
      if (!payload) {
        return res.status(400).json({ message: "Invalid input" })
      }

      const validationError = this.#likesValidator.validateId(payload)
      if (validationError) {
        res.status(400).json({ message: validationError })
      }

      const response = await this.#likesService.removePostLike(payload)
      if (response) {
        return res
          .status(response?.statusCode)
          .json({ message: response?.message })
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error)
      }
    }
  }

  public removeCommentLike = async (
    req: AuthenticatedRequest & { body: string },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const payload: string = req.body?.id
      if (!payload) {
        return res.status(400).json({ message: "Invalid input." })
      }

      const validationError = this.#likesValidator.validateId(payload)
      if (validationError) {
        res.status(400).json({ message: validationError })
      }

      const response = await this.#likesService.removeCommentLike(payload)
      if (response) {
        return res
          .status(response?.statusCode)
          .json({ message: response?.message })
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error)
      }
    }
  }
}

export default new LikesController()
