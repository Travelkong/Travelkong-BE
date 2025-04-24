import postgresqlConnection from "~/configs/postgresql.config"
import type { Logger } from "~/miscs/logger"
import type { AddPostDTO } from "./interfaces/postContent.dto"
import type { PostsModel } from "./posts.model"

export default class PostsRepository {
  constructor(private readonly _logger: Logger) {}

  public get = async (id: string): Promise<PostsModel | undefined> => {
    try {
      const query = "SELECT post_from_id($1) AS post"
      const response = await postgresqlConnection.query(query, [id])
      return response?.rows[0]?.post as PostsModel
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public getAll = async (): Promise<PostsModel[] | undefined> => {
    try {
      const query = "SELECT all_posts() AS posts"
      const response = await postgresqlConnection.query(query)
      return response?.rows[0]?.posts as PostsModel[]
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public getPostHistory = async (
    postId: string,
  ): Promise<PostsModel[] | undefined> => {
    try {
      const query = "SELECT * FROM post_history WHERE post_id = $1"
      const response = await postgresqlConnection.query(query, [postId])
      return response.rows as PostsModel[]
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
    let { title, coverImageUrl, body, images } = postContent
    images = JSON.stringify(images)
    try {
      const query =
        "INSERT INTO post_contents (id, title, cover_image_url, body, images) VALUES ($1, $2, $3, $4, $5) RETURNING id"
      const response = await postgresqlConnection.query(query, [
        id,
        title,
        coverImageUrl,
        body,
        images,
      ])

      if (response?.rowCount === 1) {
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
        "INSERT INTO posts (id, user_id, post_content_id) VALUES ($1, $2, $3)"
      const response = await postgresqlConnection.query(query, [
        id,
        userId,
        postContentId,
      ])

      if (response?.rowCount === 1) return id
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

  public edit = async (
    query: string,
    values: unknown[],
  ): Promise<boolean | undefined> => {
    try {
      const response = await postgresqlConnection.query(query, values)
      return response?.rowCount === 1
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public deletePostTags = async (
    postId: string,
    tagId: string,
  ): Promise<boolean | undefined> => {
    try {
      const query = "SELECT remove_post_tags($1, $2)"
      const response = await postgresqlConnection.query(query, [tagId, postId])
      return response?.rowCount === 1
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public delete = async () => {}
}
