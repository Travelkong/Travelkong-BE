import type { Response, NextFunction } from "express"

import CommentsService from "./comments.service"
import CommentsValidator from "./comments.validator"
import type { AuthenticatedRequest } from "~/middlewares"
import type { CommentModel } from "./comments.model"

class CommentsController {
  readonly #commentsService: CommentsService
  readonly #commentsValidator: CommentsValidator

  constructor() {
    this.#commentsService = new CommentsService()
    this.#commentsValidator = new CommentsValidator()
  }

  public get = async (
    req: AuthenticatedRequest & { body: string },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const id = req.body
      if (!id) {
        return res.status(400).json({ message: "The ID must not be blank." })
      }

      const validationError = this.#commentsValidator.validateId(id)
      if (validationError) {
        return res.status(400).json({ message: validationError })
      }

      const response = await this.#commentsService.get(id)
      if (response) {
        return res.status(response.statusCode).json({ message: response.message })
      }
    } catch (error: unknown) {
      next(error)
    }
  }

  public add = async (
    req: AuthenticatedRequest & { body: CommentModel },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const payload = req.body
      if (!payload) {
        return res.status(400).json({ message: "Comments must not be blank." })
      }

      const userId: string | undefined = req.user?.userId
      if (!userId) {
        return res.status(401).json({
          message: "You don't have the permission to create a comment.",
        })
      }

      const response = await this.#commentsService.add(userId, payload)
      if (!response?.error) {
        return res
          .status(response?.statusCode as number)
          .json({ message: "Comment created" })
      }

      return res
        .status(500)
        .json({ message: "Internal server error", response })
    } catch (error: unknown) {
      next(error)
    }
  }

  public edit = async () => {}

  public delete = async () => {}
}

export default new CommentsController()
