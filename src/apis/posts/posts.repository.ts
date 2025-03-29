import { Logger } from "~/miscs/logger"
import type { AddPostDTO } from "./interfaces/postContent.dto"
import postgresqlConnection from "~/configs/postgresql.config"

export default class PostsRepository {
  readonly #logger: Logger

  constructor() {
    this.#logger = new Logger()
  }

  public get = async (id: string) => {

  }

  public getAll = async () => {

  }

  public addPost = async (
    id: string,
    userId: string,
    postContentId: string,
    tags?: string[],
  ): Promise<string | undefined> => {
    try {
      const query =
        "INSERT INTO posts (id, user_id, post_content_id, tags) VALUES ($1, $2, $3, $4) RETURNING id"
      const [response] = await postgresqlConnection.query(query, [
        id,
        userId,
        postContentId,
        tags ?? null,
      ])

      return response?.id
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
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
        this.#logger.error(error)
      }

      throw error
    }
  }

  // Necessary for the join table
  public async addPostTags(postId: string, tagId: string): Promise<boolean | undefined> {
    try {
      const query = "INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)"
      const response = await postgresqlConnection.query(query, [postId, tagId])

      return response?.rowCount === 1
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }
}
