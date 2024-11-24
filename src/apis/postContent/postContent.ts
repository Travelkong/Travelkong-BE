import postgresqlConnection from "~/configs/postgresql.config"
import { Request, Response, NextFunction } from "express"

import { CreatePostContentDTO } from "./interfaces/postContent.dto"
import { Logger } from "~/miscs/logger"
import { generateId } from "~/miscs/helpers/generateIds"

const logger = new Logger()

export const createPostContent = async (
  req: Request<{}, {}, CreatePostContentDTO>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // TODO: Implementing images and tags
  const { title, cover_image_url, body, images, tags } = req.body

  const postContentId = generateId()
  const imagesList = images ? JSON.stringify(images) : null
  const tagsList = tags ? JSON.stringify(tags) : null

  try {
    const queryString = `INSERT INTO post_contents (id, title, cover_image_url, body, images, tags) VALUES ($1, $2, $3, $4, $5, $6)`
    const postContent = [
      postContentId,
      title,
      cover_image_url,
      body,
      imagesList,
      tagsList,
    ]

    const result = await postgresqlConnection.query(queryString, postContent)
    if (result?.length) {
      throw new Error("Cannot create post content!")
    }

    res.status(201).json({ message: "Post content created succesfully" })
  } catch (error: any) {
    logger.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}
