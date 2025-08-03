import type { Request, Response, NextFunction } from "express"

import TagsService from "./tags.service"
import TagsValidator from "./tags.validator"
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
      const response = await this.#tagsService.findAll()
      if (response) {
        return res.status(response?.statusCode).json({
          total: response?.total,
          response: response?.response,
          message: response?.message,
        })
      }
    } catch (error) {
      next(error)
    }
  }

  public findByName = async (
    req: Request & { body: string },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const payload = req?.body?.name
      if (!payload) {
        return res.status(400).json({ message: "Invalid input." })
      }

      const validationError = this.#tagsValidator.tagName(payload)
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
    req: Request & { body: TagsModel },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const userId: string | undefined = req.user?.userId
      if (!userId) {
        return res.status(401).json({ message: "No user id provided." })
      }

      const payload = req?.body?.name
      if (!payload) {
        return res.status(400).json({ message: "Invalid input." })
      }

      const validationError = this.#tagsValidator.tagName(payload)
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
    req: Request & { body: TagsModel },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const userId: string | undefined = req.user?.userId
      if (!userId) {
        return res.status(401).json({ message: "No user id provided." })
      }

      const { id, name } = req.body
      if (!id && !name) {
        return res.status(400).json({ message: "Invalid input." })
      }

      const idValidationError = this.#tagsValidator.tagId(id)
      const nameValidationError = this.#tagsValidator.tagName(name)
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
    req: Request & { body: string },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const userId: string | undefined = req.user?.userId
      if (!userId) {
        return res.status(401).json({ message: "No user id provided." })
      }

      const id = req.body?.id
      if (!id) {
        return res.status(400).json({ message: "Invalid input." })
      }

      const validationError = this.#tagsValidator.tagId(id)
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
