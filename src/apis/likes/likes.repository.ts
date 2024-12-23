import postgresqlConnection from "~/configs/postgresql.config"
import { Logger } from "~/miscs/logger"
import type LikesModel from "./likes.model"
import type { QueryResultRow } from "pg"
import { generateId } from "~/miscs/helpers/generateIds"
import type { BaseResponse } from "~/miscs/others"

interface ILikesRepository {
  getAll(userId: string): Promise<LikesModel[] | undefined>
}

export default class LikesRepository implements ILikesRepository {
  readonly #logger: Logger

  constructor() {
    this.#logger = new Logger()
  }

  public getAll = async (userId: string): Promise<LikesModel[] | undefined> => {
    try {
      const queryString: string =
        "SELECT id, post_id, user_id, created_at, updated_at FROM post_likes WHERE user_id = $1"
      const response: QueryResultRow[] = await postgresqlConnection.query(
        queryString,
        [userId],
      )

      if (response) {
        return response as LikesModel[]
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
        throw error
      }
    }
  }

  public findPostLike = async (
    postId: string,
    userId: string,
  ): Promise<number | undefined> => {
    try {
      const postQueryString: string =
        "SELECT * FROM post_likes WHERE (post_id, user_id) = ($1, $2) LIMIT 1"
      const result = await postgresqlConnection.query(postQueryString, [
        postId,
        userId,
      ])

      // Automatically equates to 0 if the user has not liked this post yet.
      return result?.length ?? 0
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
        throw error
      }
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
      return response?.length === 1
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
        throw error
      }
    }
  }
}
