import postgresqlConnection from "~/configs/postgresql.config"
import type { Logger } from "~/miscs/logger"
import type { AddPostDTO } from "./interfaces/postContent.dto"

export default class PostsRepository {
  constructor(private readonly _logger: Logger) {}

  public get = async (id: string) => {
    try {
      const query =
        "SELECT * FROM posts INNER JOIN post_contents ON posts.post_content_id = post_contents.id WHERE posts.id = $1"
      const [response] = await postgresqlConnection.query(query, [id])
      return response
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public getAll = async () => {
    try {
      const query = "SELECT * FROM posts INNER JOIN post_contents ON posts.post_content_id = post_contents.id"
      const [response] = await postgresqlConnection.query(query)
      return response
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public addPostContent = async (
    postContent: AddPostDTO,
    id: string,
  ): Promise<string | undefined> => {
    const { title, coverImageUrl, body, images } = postContent
    try {
      const query =
        "INSERT INTO post_contents (id, title, cover_image_url, body, images) VALUES ($1, $2, $3, $4, $5) RETURNING id"
      const [response] = await postgresqlConnection.query(query, [
        id,
        title,
        coverImageUrl,
        body,
        images,
      ])

      if (response?.length === 1) {
        return id
      }
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public addPost = async (
    id: string,
    userId: string,
    postContentId: string,
    tags?: string[],
  ): Promise<string | undefined> => {
    try {
      const query =
        "INSERT INTO posts (id, user_id, post_content_id) VALUES ($1, $2, $3) RETURNING id"
      const [response] = await postgresqlConnection.query(query, [
        id,
        userId,
        postContentId,
      ])

      return response?.id
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  // Necessary for the join table
  public async addPostTags(
    postId: string,
    tagId: string,
  ): Promise<boolean | undefined> {
    try {
      const query = "INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)"
      const response = await postgresqlConnection.query(query, [postId, tagId])

      return response?.rowCount === 1
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }
}