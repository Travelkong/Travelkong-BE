import postgresqlConnection from "~/configs/postgresql.config"
import { NextFunction, Request, Response } from "express"

import { Logger } from "~/miscs/logger"
import { AuthenticatedRequest } from "~/middlewares"
import { PostModel } from "./post.model"
import { createPostContent } from "./postContent"

require("dotenv").config()

const logger: Logger = new Logger()

export const Create = async (
  req: AuthenticatedRequest & { body: PostModel }, // PostModel is just a placeholder for now.
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Validate the input via a library such as Joi.

    const { user_id, post_content } = req.body

    const userId = req.user?.userId
    // const postContentId = await createPostContent()

    const postQuery = `INSERT INTO posts (user_id, post_content_id, likes_count, comments, comments_count, views_count) VALUES ($1, $2, $3, $4, $5, $6, $7)`
    const postResult = await postgresqlConnection.query(postQuery, [
      userId,
      0,
      0,
      null,
      0,
      0,
    ])
    if (!postResult.length) {
      throw new Error("Cannot create post!")
    } else {
      res.status(201).json({ message: "Post created successfully" })
    }
  } catch (error: any) {
    logger.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}
