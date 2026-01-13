import type { NextFunction, Request, Response } from "express"

import { HTTP_STATUS } from "~/miscs/utils"
import { FindByUserQuery } from "../../application/queries"
import type { FindByUserHandler } from "../../application/queries/handlers"
import type CommentsValidator from "../../validator"
import type { FindCommentDto } from "../dtos"

export class FindByUserController {
  constructor(
    private readonly _validator: CommentsValidator,
    private readonly _handler: FindByUserHandler,
  ) {}

  public async handle(
    req: Request & { body: FindCommentDto },
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

      const query = new FindByUserQuery(id)
      const response = await this._handler.execute(query)
      if (!response) {
        return res
          .status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code)
          .json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message })
      }

      if (response.length === 0) {
        return res
          .status(HTTP_STATUS.NO_CONTENT.code)
          .json({ message: HTTP_STATUS.NO_CONTENT.message })
      }

      return res
        .status(HTTP_STATUS.OK.code)
        .json({ message: HTTP_STATUS.OK.message, data: response })
    } catch (error) {
      next(error)
    }
  }
}
