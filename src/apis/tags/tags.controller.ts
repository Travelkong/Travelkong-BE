import type { Request, Response, NextFunction } from "express"

import TagsService from "./tags.service"
import TagsValidator from "./tags.validator"
import { isAdmin } from "~/middlewares"
import type { AuthenticatedRequest } from "~/middlewares"
import type TagsModel from "./tags.model"

class TagsController {
  readonly #tagsService: TagsService
  readonly #tagsValidator: TagsValidator

  constructor() {
    this.#tagsService = new TagsService()
    this.#tagsValidator = new TagsValidator()
  }

  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const result = await this.#tagsService.findAll()
      if (result) {
        return res.status(result?.statusCode).json({
          total: result?.total,
          response: result?.response,
          message: result?.message,
        })
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error)
      }
    }
  }

  public findByName = async (
    req: AuthenticatedRequest & { body: string },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const payload = req?.body?.name
      if (!payload) {
        return res.status(400).json({ message: "Invalid input." })
      }

      const validationError = this.#tagsValidator.validateTagName(payload)
      if (validationError) {
        return res.status(400).json({ message: validationError })
      }

      const response = await this.#tagsService.findByName(payload)
      if (response) {
        return res
          .status(response?.statusCode)
          .json({ message: response?.message, data: response?.data })
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error)
      }
    }
  }

  public add = async (
    req: AuthenticatedRequest & { body: TagsModel },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const userId: string | undefined = req?.user?.userId
      if (!userId) {
        return res.status(401).json({ message: "No user id provided." })
      }

      const checksAdmin: boolean | undefined = await isAdmin(userId)
      if (!checksAdmin) {
        return res
          .status(403)
          .json({ message: "You are not authorized for this action." })
      }

      const payload = req?.body?.name
      if (!payload) {
        return res.status(400).json({ message: "Invalid input." })
      }

      const validationError = this.#tagsValidator.validateTagName(payload)
      if (validationError) {
        return res.status(400).json({ message: validationError })
      }

      const response = await this.#tagsService.add(payload)
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

  public update = async (
    req: AuthenticatedRequest & { body: TagsModel },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const userId: string | undefined = req?.user?.userId
      if (!userId) {
        return res.status(401).json({ message: "No user id provided." })
      }

      const checksAdmin: boolean | undefined = await isAdmin(userId)
      if (!checksAdmin) {
        return res
          .status(403)
          .json({ message: "You are not authorized for this action." })
      }

      const { id, name } = req.body
      if (!id && !name) {
        return res.status(400).json({ message: "Invalid input." })
      }

      const idValidationError = this.#tagsValidator.validateTagId(id)
      const nameValidationError = this.#tagsValidator.validateTagName(name)
      if (idValidationError || nameValidationError) {
        return res
          .status(400)
          .json({ message: idValidationError || nameValidationError })
      }

      const response = await this.#tagsService.update(id, name)
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

  public delete = async (
    req: AuthenticatedRequest & { body: string },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const userId: string | undefined = req?.user?.userId
      if (!userId) {
        return res.status(401).json({ message: "No user id provided." })
      }

      const checksAdmin: boolean | undefined = await isAdmin(userId)
      if (!checksAdmin) {
        return res
          .status(403)
          .json({ message: "You are not authorized for this action." })
      }

      const id = req.body?.id
      if (!id) {
        return res.status(400).json({ message: "Invalid input." })
      }

      const validationError = this.#tagsValidator.validateTagId(id)
      if (validationError) {
        return res.status(400).json({ message: validationError })
      }

      const response = await this.#tagsService.delete(id)
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

export default new TagsController()
