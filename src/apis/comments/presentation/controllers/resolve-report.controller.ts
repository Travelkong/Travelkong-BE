import type { NextFunction, Request, Response } from "express"
import { HTTP_STATUS } from "~/miscs/utils"
import { ResolveReportCommand } from "../../application/commands"
import type { ResolveReportHandler } from "../../application/commands/handlers"
import type CommentsValidator from "../../validator"
import { type FindCommentDto, ReportResponse } from "../dtos"

export class ResolveReportController {
  constructor(
    private readonly _validator: CommentsValidator,
    private readonly _handler: ResolveReportHandler,
  ) {}

  public handle = async (
    req: Request & { body: FindCommentDto },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const payload = req.body?.id
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

      const validationErrors = this._validator.id(payload)
      for (const validationError in validationErrors) {
        res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: validationError })
      }

      const command = new ResolveReportCommand(payload)
      const response = await this._handler.execute(command)
      if (response === ReportResponse.Updated) {
        return res
          .status(HTTP_STATUS.OK.code)
          .json({ message: HTTP_STATUS.OK.message })
      } else if (response === ReportResponse.NotFound) {
        return res
          .status(HTTP_STATUS.NOT_FOUND.code)
          .json({ message: HTTP_STATUS.NOT_FOUND.message })
      } else if (response === ReportResponse.Existed) {
        return res
          .status(HTTP_STATUS.CONFLICT.code)
          .json({ message: HTTP_STATUS.CONFLICT.message })
      }

      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code)
        .json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message })
    } catch (error) {
      next(error)
    }
  }
}
