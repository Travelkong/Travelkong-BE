import type { NextFunction, Request, Response } from "express"

import { HTTP_STATUS } from "~/miscs/utils"
import { FindAllQuery } from "../../application/queries"
import type { FindAllHandler } from "../../application/queries/handlers"

export class FindAllController {
  constructor(private readonly _handler: FindAllHandler) {}

  public async handle (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> {
    try {
      const query = new FindAllQuery()
      const response = await this._handler.execute(query)
      if (!response) {
        return res
          .status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code)
          .json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message })
      }

      if (response.length === 0) {
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
