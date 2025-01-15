import type { Request, Response, NextFunction } from "express"

import TagsService from "./tags.service"
import TagsValidator from "./tags.validator"

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
      next(error)
    }
  }

  public find = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {}
}

export default new TagsController()
