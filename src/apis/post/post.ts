import postgresqlConnection from "~/configs/postgresql.config"
import { NextFunction, Response } from "express"

import { Logger } from "~/miscs/logger"
import { AuthenticatedRequest } from "~/middlewares"
import { PostModel } from "./post.model"
import { createPostContent } from "./postContent"
import { PostContentModel } from "./postContent.model"
import { generateId } from "~/miscs/helpers/generateIds"

require("dotenv").config()

const logger: Logger = new Logger()

export const Create = async (
  req: AuthenticatedRequest & {
    body: Partial<PostModel> & { post_content: PostContentModel }
  },
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Validate the input via a library such as Joi.

    const { post_content } = req.body
    if (!post_content) {
      res.status(400).json({ message: "Post content is required!" })
    }

    const userId = req.user
    if (!userId) {
      res
        .status(401)
        .json({ message: "You don't have the permission to create a post!" })
    }

    const postId: string = generateId()
    const postContentId = await createPostContent(post_content)
    if (!postContentId) throw new Error("Failed to create post content!")

    const postQuery = `INSERT INTO posts (id, user_id, post_content_id) VALUES ($1, $2, $3)`
    const postResult = await postgresqlConnection.query(postQuery, [
      postId,
      userId,
      postContentId,
    ])
    
    if (postResult.length) {
      throw new Error("Cannot create post!")
    } else {
      res.status(201).json({ message: "Post created successfully" })
    }
  } catch (error: any) {
    logger.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}
