import postgresqlConnection from "~/configs/postgresql.config"
import { NextFunction, Request, Response } from "express"

import { Logger } from "~/miscs/logger"

require("dotenv").config()

const logger: Logger = new Logger()

export const Create = async (
  req: Request<{}, {}>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Validate the input via a library such as Joi.

    const { user_id, post_content } = req.body

    const userId = (req as any).user

    const postQuery = `INSERT INTO posts (user_id, post_content_id, liked, likes_count, comments, comments_count, views_count) VALUES ($1, $2, $3, $4, $5, $6, $7)`
    const postResult = await postgresqlConnection.query(postQuery, [
      user_id,
      null,
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
