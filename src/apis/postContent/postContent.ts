import postgresqlConnection from "~/configs/postgresql.config"
import { Request, Response, NextFunction } from "express"

import { CreatePostContentDTO } from "./interfaces/postContent.dto"
import { Logger } from "~/miscs/logger"

const logger = new Logger()

export const createPostContent = async (
  req: Request<{}, {}, CreatePostContentDTO>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // TODO: Implementing images and tags
  const { title, cover_image_url, body, images, tags } = req.body
  console.log(req.headers["Authorization"])

  try {
    const queryString = `INSERT INTO post_contents (id, title, cover_image_url, body, images, tags) VALUES (?, ?, ?, ?, ?, ?)`
    const postContent = [
      req.headers["Authorization"],
      title,
      cover_image_url ?? null,
      body,
      images ?? null,
      tags ?? null,
    ]

    const result = await postgresqlConnection.query(queryString, postContent)
    if (!result.length) {
      throw new Error("Cannot create post content!")
    } else {
      res.status(201).json({ message: "Post content created succesfully" })
    }
  } catch (error: any) {
    logger.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}
