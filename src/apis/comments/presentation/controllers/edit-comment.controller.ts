import type { NextFunction, Request, Response } from "express"

import { HTTP_STATUS } from "~/miscs/utils"
import {
  CheckUserCommand,
  EditCommentCommand,
} from "../../application/commands"
import type {
  CheckUserHandler,
  EditCommentHandler,
} from "../../application/commands/handlers"
import type CommentsValidator from "../../validator"
import type { EditCommentDTO } from "../dtos"

export class EditCommentController {
  constructor(
    private readonly _validator: CommentsValidator,
    private readonly _checkUserHandler: CheckUserHandler,
    private readonly _editHandler: EditCommentHandler,
  ) {}

  public async handle(
    req: Request & { body: EditCommentDTO },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> {
    try {
      const payload: EditCommentDTO = req.body
      if (!payload) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: "Comments must not be blank." })
      }

      const userId = req.user?.userId
      if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED.code).json({
          message: "You need to be logged in before editing a comment.",
        })
      }

      const validationErrors = this._validator.edit(payload)
      for (const validationError in validationErrors) {
        res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: validationError })
      }

      const sameUserCommand = new CheckUserCommand(payload.id, userId)
      const isSameUser = await this._checkUserHandler.execute(sameUserCommand)
      if (!isSameUser) {
        return res
          .status(HTTP_STATUS.FORBIDDEN.code)
          .json({ message: "Cannot edit other users' comments." })
      }

      const command = new EditCommentCommand(
        payload.id,
        payload.content,
        payload?.images,
      )
      const response = await this._editHandler.execute(command)
      if (response) {
        return res
          .status(HTTP_STATUS.OK.code)
          .json({ message: "Comment updated." })
      }

      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code)
        .json({ message: response })
    } catch (error) {
      next(error)
    }
  }
}
