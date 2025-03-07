import type { NextFunction, Response } from "express"

import postgresqlConnection from "~/configs/postgresql.config"
import { Logger } from "~/miscs/logger"
import type { AuthenticatedRequest } from "~/middlewares"
import type { PostsModel } from "./posts.model"
import { createPostContent } from "./postContent"
import type { PostContentModel } from "./postContent.model"
import { generateId } from "~/miscs/helpers/generateIds"

require("dotenv").config()

const logger: Logger = new Logger()

export const Create = async (
  req: AuthenticatedRequest & {
    body: Partial<PostsModel> & { postContent: PostContentModel }
  },
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Validate the input.

    const postContent = req.body
    if (!postContent) {
      res.status(400).json({ message: "Post content is required!" })
    }

    const userId = req.user?.userId
    if (!userId) {
      res
        .status(401)
        .json({ message: "You don't have the permission to create a post!" })
    }

    const postId: string = generateId()
    const postContentId = await createPostContent(postContent)
    if (!postContentId) throw new Error("Failed to create post content!")

    const postQuery: string = "INSERT INTO posts (id, user_id, post_content_id) VALUES ($1, $2, $3)"
    const postResult = await postgresqlConnection.query(postQuery, [
      postId,
      userId,
      postContentId,
    ])

    if (postResult.length) {
      throw new Error("Cannot create post!")
    }

    res.status(201).json({ message: "Post created successfully" })
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(error)
      res.status(500).json({ message: "Internal server error" })
    }
  }
}
