import type { NextFunction, Request, Response } from "express"

import { isAdmin } from "~/miscs/helpers"
import { HTTP_STATUS } from "~/miscs/utils"
import { DeleteCommentCommand } from "../../application/commands"
import type { DeleteCommentHandler } from "../../application/commands/handlers"
import type CommentsValidator from "../../validator"
import type { FindCommentDto } from "../dtos"

export class DeleteCommentController {
  constructor(
    private readonly _validator: CommentsValidator,
    private readonly _handler: DeleteCommentHandler,
  ) {}

  public async handle(
    req: Request & { body: FindCommentDto },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> {
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

      const validationError = await this._validator.id(userId)
      if (validationError) {
        res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: validationError })
      }

      const checksAdmin = await isAdmin(userId)
      if (checksAdmin === undefined) {
        return res
          .status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code)
          .json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message })
      }

      // Keeps the content of the comment if the delete-r is not an admin, nukes it otherwise.
      const command = new DeleteCommentCommand(payload, checksAdmin)
      const response = await this._handler.execute(command)
      if (response) {
        return res
          .status(HTTP_STATUS.OK.code)
          .json({ message: HTTP_STATUS.OK.message })
      } else if (response === false) {
        return res
          .status(HTTP_STATUS.NOT_FOUND.code)
          .json({ message: HTTP_STATUS.NOT_FOUND.message })
      }

      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code)
        .json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message })
    } catch (error) {
      next(error)
    }
  }
}
