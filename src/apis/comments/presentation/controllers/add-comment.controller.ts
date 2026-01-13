import type { NextFunction, Request, Response } from "express"

import { HTTP_STATUS } from "~/miscs/utils"
import { AddCommentCommand } from "../../application/commands"
import type { AddCommentHandler } from "../../application/commands/handlers"
import type CommentsValidator from "../../validator"
import type { AddCommentDto } from "../dtos"

export class AddCommentController {
  constructor(
    private readonly _validator: CommentsValidator,
    private readonly _handler: AddCommentHandler,
  ) {}

  /**
   * Find a comment by it's id.
   * @param req
   * @param res
   * @param next
   * @returns
   */
  public async handle(
    req: Request & { body: AddCommentDto },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> {
    try {
      const payload = req.body
      if (!payload) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: "Comments must not be blank." })
      }

      const userId: string | undefined = req.user?.userId
      if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED.code).json({
          message: "You need to log in before adding a comment.",
        })
      }

      const validationErrors = this._validator.add(payload)
      for (const validationError in validationErrors) {
        res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: validationError })
      }

      const command = new AddCommentCommand(
        payload.id,
        payload.postId,
        payload.userId,
        payload.content,
        payload.level,
        payload.status,
        payload?.parentCommentId,
        payload?.images,
      )
      const response = await this._handler.execute(command)
      if (response) {
        return res
          .status(HTTP_STATUS.OK.code)
          .json({ message: "Comment created." })
      }

      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code)
        .json({ message: response })
    } catch (error: unknown) {
      next(error)
    }
  }
}
