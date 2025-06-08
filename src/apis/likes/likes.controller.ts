import type { Request, Response, NextFunction } from "express"

import LikesService from "./likes.service"
import LikesValidator from "./likes.validator"
import type { CommentLikes } from "./interfaces/commentLikes.interface"
import type LikesResponse from "./likes.response"
import type { PostLikes } from "./interfaces/postLikes.interface"
import type { LikesRequest } from "./interfaces/likes.interface"

class LikesController {
  readonly #likesService: LikesService
  readonly #likesValidator: LikesValidator

  constructor() {
    this.#likesService = new LikesService()
    this.#likesValidator = new LikesValidator()
  }

  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const userId: string | undefined = req.user?.userId
      if (!userId) {
        return res.status(401).json({ message: "No user ID provided." })
      }

      const response: LikesResponse | undefined = await this.#likesService.getAll(
        userId,
      )
      if (response) {
        return res.status(response?.statusCode).json({
          message: response?.message,
          total: response?.total,
          response: response?.response,
        })
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error)
      }
    }
  }

  public getPostLikes = async (
    req: { body: LikesRequest },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const payload = req.body?.id
      if (!payload) {
        return res.status(400).json({ message: "Invalid input" })
      }

      const validationError = this.#likesValidator.validateId(payload)
      if (validationError) {
        return res.status(400).json({ validationError })
      }

      const response = await this.#likesService.getPostLikes(payload)
      if (response) {
        return res.status(response.statusCode).json({
          message: response?.message,
          total: response.total,
          response: response.response,
        })
      }
    } catch (error) {
      next(error)
    }
  }

  public getCommentLikes = async (
    req: { body: LikesRequest },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const payload = req.body?.id
      if (!payload) {
        return res.status(400).json({ message: "Invalid input" })
      }

      const validationError = this.#likesValidator.validateId(payload)
      if (validationError) {
        return res.status(400).json({ validationError })
      }

      const response = await this.#likesService.getCommentLikes(payload)
      if (response) {
        return res.status(response.statusCode).json({
          message: response?.message,
          total: response.total,
          response: response.response,
        })
      }
    } catch (error) {
      next(error)
    }
  }

  public isPostLiked = async (
    req: Request & { body: LikesRequest },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ message: "No user ID provided." })
      }

      const payload = req.body?.id
      if (!payload) {
        return res.status(400).json({ message: "Invalid input" })
      }

      const validationError = this.#likesValidator.validateId(payload)
      if (validationError) {
        return res.status(400).json({ validationError })
      }

      const response = await this.#likesService.isPostLiked(userId, payload)
      if (response) {
        return res
          .status(response.statusCode)
          .json({ message: response.message })
      }
    } catch (error) {
      next(error)
    }
  }

  public isCommentLiked = async (
    req: Request & { body: LikesRequest },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const userId: string | undefined = req.user?.userId
      if (!userId) {
        return res.status(401).json({ message: "No user ID provided." })
      }

      const payload = req.body?.id
      if (!payload) {
        return res.status(400).json({ message: "Invalid input" })
      }

      const validationError = this.#likesValidator.validateId(payload)
      if (validationError) {
        return res.status(400).json({ validationError })
      }

      const response = await this.#likesService.isCommentLiked(userId, payload)
      if (response) {
        return res
          .status(response.statusCode)
          .json({ message: response.message })
      }
    } catch (error) {
      next(error)
    }
  }

  public addPostLike = async (
    req: Request & { body: PostLikes },
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

  // TODO: find a way to merge these two functions (and all the subsequent ones) since they are pretty similar.
  public addCommentLike = async (
    req: Request & { body: CommentLikes },
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

      const validationError = this.#likesValidator.validateCommentLike(payload)
      if (validationError) {
        return res.status(400).json({ validationError })
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
    req: Request & { body: string },
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
    req: Request & { body: string },
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
