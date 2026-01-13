import type { NextFunction, Request, Response } from "express"

import { HTTP_STATUS } from "~/miscs/utils"
import { AddReportCommand } from "../../application/commands/add-report.command"
import type { AddReportHandler } from "../../application/commands/handlers"
import type CommentsValidator from "../../validator"
import type { AddReportDto } from "../dtos"

export class AddReportController {
  constructor(
    private readonly _validator: CommentsValidator,
    private readonly _handler: AddReportHandler,
  ) {}

  public async handle(
    req: Request & { body: AddReportDto },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> {
    try {
      const payload: AddReportDto = req.body
      if (!payload) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: HTTP_STATUS.BAD_REQUEST.message })
      }

      const userId = req.user?.userId
      if (!userId) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED.code)
          .json({ message: HTTP_STATUS.UNAUTHORIZED.message })
      }

      const validationErrors = this._validator.addReport(payload)
      for (const validationError in validationErrors) {
          res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: validationError })
      }

      const command = new AddReportCommand(payload.commentId, userId, payload.reason)
      const response = await this._handler.execute(command)
      if (response === undefined) {
        return res
          .status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code)
          .json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message })
      }

      if (response === false) {
        return res
          .status(HTTP_STATUS.NOT_FOUND.code)
          .json({ message: HTTP_STATUS.NOT_FOUND.message })
      }

      return res
        .status(HTTP_STATUS.OK.code)
        .json({ message: HTTP_STATUS.OK.message })
    } catch (error) {
      next(error)
    }
  }
}
