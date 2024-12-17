import postgresqlConnection from "~/configs/postgresql.config"
import type { PostContentModel } from "./postContent.model"
import { Logger } from "~/miscs/logger"
import { generateId } from "~/miscs/helpers/generateIds"

const logger = new Logger()

export const createPostContent = async (
  postContentData: PostContentModel
): Promise<string | undefined> => {
  // TODO: Implementing images and tags
  const { title, cover_image_url, body, images, tags } = postContentData

  const postContentId = generateId()
  const imagesList = images ? JSON.stringify(images) : null
  const tagsList = tags ? JSON.stringify(tags) : null

  try {
    const queryString = "INSERT INTO post_contents (id, title, cover_image_url, body, images, tags) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id"
    const postContent = [
      postContentId,
      title,
      cover_image_url,
      body,
      imagesList,
      tagsList,
    ]

    const result = await postgresqlConnection.query(queryString, postContent)
    if (!result?.length) {
      throw new Error("Cannot create post content!")
    }

    return postContentId
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(error)
      throw new Error("Internal server error")
    }
  }
}
