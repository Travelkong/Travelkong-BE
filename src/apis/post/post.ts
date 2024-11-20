import postgresqlConnection from "~/configs/postgresql.config"
import { NextFunction, Request, Response } from "express"

import { CreatePostDTO } from "./post.dto"

require("dotenv").config()

export const Create = async (
  req: Request<{}, {}, CreatePostDTO>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Validate the input via a library such as Joi.

    const { user_id, post_content } = req.body

    // TODO: Implementing images and tags
    const { id: post_content_id, title, cover_image_url, body, images, tags } = post_content

    const query = ``

    res.status(201).json({ message: "Post created successfully" })
  } catch (error) {
    console.log(error)
  }
}
