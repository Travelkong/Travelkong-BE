import type { Response, NextFunction } from "express"

import CommentsService from "./comments.service"
import CommentsValidator from "./comments.validator"
import { isAdmin, type AuthenticatedRequest } from "~/middlewares"
import type CommentsModel from "./comments.model"
import type { UpdateCommentDTO } from "./comments.dto"
import type { CommentsRequest } from "./comments.interface"

class CommentsController {
  readonly #commentsService: CommentsService
  readonly #commentsValidator: CommentsValidator

  constructor() {
    this.#commentsService = new CommentsService()
    this.#commentsValidator = new CommentsValidator()
  }

  public get = async (
    req: { body: CommentsRequest },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const id = req.body?.id
      if (!id) {
        return res.status(400).json({ message: "The ID must not be blank." })
      }

      const validationError = this.#commentsValidator.validateId(id)
      if (validationError) {
        return res.status(400).json({ message: validationError })
      }

      const response = await this.#commentsService.get(id)
      if (response) {
        return res
          .status(response.statusCode)
          .json({ message: response.message, data: response?.response })
      }
    } catch (error: unknown) {
      next(error)
    }
  }

  public add = async (
    req: AuthenticatedRequest & { body: CommentsModel },
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
          message: "You need to log in before adding a comment.",
        })
      }

      const validationError =
        this.#commentsValidator.validateAddComment(payload)
      if (validationError) {
        res.status(400).json({ message: validationError })
      }

      const response = await this.#commentsService.add(userId, payload)
      if (!response?.error) {
        return res
          .status(response?.statusCode as number)
          .json({ message: "Comment created." })
      }

      return res
        .status(500)
        .json({ message: "Internal server error", response })
    } catch (error: unknown) {
      next(error)
    }
  }

  public edit = async (
    req: AuthenticatedRequest & { body: UpdateCommentDTO },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const payload = req.body
      if (!payload) {
        return res.status(400).json({ message: "Comments must not be blank." })
      }

      const userId = req.user?.userId
      if (!userId) {
        return res
          .status(401)
          .json({ message: "You need to log in before editing a comment." })
      }

      const validationError =
        this.#commentsValidator.validateUpdateComment(payload)
      if (validationError) {
        res.status(400).json({ message: validationError })
      }

      const response = await this.#commentsService.edit(userId, payload)
      if (response) {
        return res.status(response.statusCode).json({ message: response.message })
      }
    } catch (error) {
      next(error)
    }
  }

  public delete = async (
    req: AuthenticatedRequest & { body: CommentsRequest },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const payload = req.body?.id
      if (!payload) {
        return res.status(400).json({ message: "Invalid input." })
      }

      const userId = req.user?.userId
      if (!userId) {
        return res
          .status(403)
          .json({ message: "You are not authorized for this action." })
      }

      const checksAdmin = await isAdmin(userId)
      const response = await this.#commentsService.delete(payload, checksAdmin)
      if (response) {
        return res
          .status(response.statusCode)
          .json({ message: response.message })
      }
    } catch (error: unknown) {
      next(error)
    }
  }
}

export default new CommentsController()
