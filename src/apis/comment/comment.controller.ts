import { Request, Response, NextFunction } from "express"
import { validate as isValidUUID } from "uuid"

import { Logger } from "~/miscs/logger"
import { createCommentService } from "./comment.service"
import { AuthenticatedRequest } from "~/middlewares"
import { CommentModel } from "./comment.model"

const logger = new Logger()

export const createCommentController = async (
  req: AuthenticatedRequest & { body: CommentModel },
  res: Response,
  next: NextFunction,
): Promise<Response<any, Record<string, any>> | void> => {
  try {
    const payload = req.body
    if (!payload) {
      return res.status(400).json({ message: "Comments must not be blank." })
    }

    const userId: string | undefined = req.user?.userId
    if (!userId) {
      return res
        .status(401)
        .json({ message: "You don't have the permission to create a comment." })
    }

    const response = await createCommentService(userId, payload)
    if (!response.error) {
      return res.status(201).json({ message: "Comment created" })
    } else {
      return res
        .status(500)
        .json({ message: "Internal server error", response })
    }
  } catch (error: any) {
    logger.error(error)
    next(error)
  }
}
