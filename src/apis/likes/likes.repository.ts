import postgresqlConnection from "~/configs/postgresql.config"
import { Logger } from "~/miscs/logger"
import type LikesModel from "./likes.model"
import { generateId } from "~/miscs/helpers"

interface ILikesRepository {
  getAll(userId: string): Promise<LikesModel[] | undefined>
  addPostLike(postId: string, userId: string): Promise<boolean | undefined>
  addCommentLike(
    commentId: string,
    userId: string,
  ): Promise<boolean | undefined>
  isExists({
    id,
    postId,
    commentId,
    userId,
  }: {
    id?: string
    postId?: string
    commentId?: string
    userId?: string
  }): Promise<number | undefined>
  removePostLike(id: string): Promise<boolean | undefined>
  removeCommentLike(id: string): Promise<boolean | undefined>
}

export default class LikesRepository implements ILikesRepository {
  readonly #logger: Logger

  constructor() {
    this.#logger = new Logger()
  }

  public getAll = async (userId: string): Promise<LikesModel[] | undefined> => {
    try {
      const queryString: string =
        "SELECT id, post_id, user_id FROM post_likes WHERE user_id = $1 UNION ALL SELECT id, comment_id, user_id FROM comment_likes WHERE user_id = $1"
      const response = await postgresqlConnection.query(
        queryString,
        [userId],
      )

      if (response) {
        return response.rows[0] as LikesModel[]
      }
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public getPostLikes = async (
    id: string,
  ): Promise<LikesModel[] | undefined> => {
    try {
      const query = "SELECT id, user_id FROM post_likes WHERE post_id = $1"
      const response = await postgresqlConnection.query(query, [id])

      if (response) {
        return response.rows[0] as LikesModel[]
      }
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public getCommentLikes = async (
    id: string,
  ): Promise<LikesModel[] | undefined> => {
    try {
      const query =
        "SELECT id, user_id FROM comment_likes WHERE comment_id = $1"
      const response = await postgresqlConnection.query(query, [id])

      if (response) {
        return response.rows[0] as LikesModel[]
      }
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public isExists = async ({
    id,
    postId,
    commentId,
    userId,
  }: {
    id?: string
    postId?: string
    commentId?: string
    userId?: string
  }): Promise<number | undefined> => {
    let query: string
    let values: unknown[]
    try {
      if (id) {
        query =
          "SELECT 1 FROM (SELECT id FROM post_likes WHERE id = $1 UNION ALL SELECT id FROM comment_likes WHERE id = $1) AS likes"
        values = [id]
      } else if (postId && userId) {
        query =
          "SELECT 1 FROM post_likes WHERE (post_id, user_id) = ($1, $2) LIMIT 1"
        values = [postId, userId]
      } else if (commentId && userId) {
        query =
          "SELECT 1 FROM comment_likes WHERE (comment_id, user_id) = ($1, $2) LIMIT 1"
        values = [commentId, userId]
      } else {
        throw new Error("Invalid parameters")
      }

      // Automatically equates to 0 if the user has not liked this post yet.
      const response = await postgresqlConnection.query(query, values)
      return +response.rows[0]
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public addPostLike = async (
    postId: string,
    userId: string,
  ): Promise<boolean | undefined> => {
    try {
      const id: string = generateId()
      const queryString: string =
        "INSERT INTO post_likes (id, post_id, user_id) VALUES ($1, $2, $3)"
      const response = await postgresqlConnection.query(queryString, [
        id,
        postId,
        userId,
      ])

      // TODO: Make the return less confusing.
      // This will never equates to 1.
      return response.rowCount === 1
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public addCommentLike = async (
    commentId: string,
    userId: string,
  ): Promise<boolean | undefined> => {
    try {
      const id: string = generateId()
      const queryString: string =
        "INSERT INTO comment_likes (id, comment_id, user_id) VALUES ($1, $2, $3)"
      const response = await postgresqlConnection.query(queryString, [
        id,
        commentId,
        userId,
      ])

      // This will never equates to 1.
      return response.rowCount === 1
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public removePostLike = async (id: string): Promise<boolean | undefined> => {
    try {
      const queryString: string = "DELETE FROM post_likes WHERE id = $1"
      const response = await postgresqlConnection.query(queryString, [id])

      return response.rowCount === 1
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public removeCommentLike = async (
    id: string,
  ): Promise<boolean | undefined> => {
    try {
      const queryString: string = "DELETE FROM comment_likes WHERE id = $1"
      const response = await postgresqlConnection.query(queryString, [id])

      return response.rowCount === 1
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }
}
