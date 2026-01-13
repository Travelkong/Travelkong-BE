import type { NextFunction, Response } from "express"

import { HTTP_STATUS } from "~/miscs/utils"
import { FindOneQuery } from "../../application/queries"
import type { FindOneHandler } from "../../application/queries/handlers"
import type CommentsValidator from "../../validator"
import type { FindCommentDto } from "../dtos"

export class FindOneController {
  constructor(
    private readonly _validator: CommentsValidator,
    private readonly _handler: FindOneHandler,
  ) {}

  public async handle(
    req: { body: FindCommentDto },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> {
    try {
      const id = req.body?.id
      if (!id) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: "The ID must not be blank." })
      }

      const validationErrors = this._validator.id(id)
      for (const validationError in validationErrors) {
        res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: validationError })
      }

      const query = new FindOneQuery(id)
      const response = await this._handler.execute(query)
      // TODO: might need http 500.
      if (!response) {
        return res.status(HTTP_STATUS.NO_CONTENT.code)
      }

      return res
        .status(HTTP_STATUS.OK.code)
        .json({ message: HTTP_STATUS.OK.message, data: response })
    } catch (error) {
      next(error)
    }
  }
}
