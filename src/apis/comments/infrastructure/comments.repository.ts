import postgresqlConnection from "~/configs/postgresql.config"
import type { Logger } from "~/miscs/logger"
import type Comment from "../domain"

export default class CommentsRepository {
  constructor(private readonly _logger: Logger) {}

  public findOne = async (id: string): Promise<Comment | undefined> => {
    try {
      const query = "select * from comments where id = $1"
      const response = await postgresqlConnection.query(query, [id])
      console.log(response)
      return response.rows[0] as Comment
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public findByPost = async (
    postId: string,
  ): Promise<Comment[] | undefined> => {
    try {
      const query = "select * from comments where post_id = $1"
      const response = await postgresqlConnection.query(query, [postId])

      return (response.rows[0] as Comment[]) ?? undefined
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public findByUser = async (
    userId: string,
  ): Promise<Comment[] | undefined> => {
    try {
      const query = "select * from comments where user_id = $1"
      const response = await postgresqlConnection.query(query, [userId])

      return (response.rows[0] as Comment[]) ?? undefined
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public findAll = async (): Promise<Comment[] | undefined> => {
    try {
      const query = "select * from comments"
      const response = await postgresqlConnection.query(query)

      return response?.rows[0] as Comment[]
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public add = async (payload: Comment): Promise<boolean | undefined> => {
    const {
      id,
      parentCommentId,
      postId,
      userId,
      content,
      images,
      level,
      status,
    } = payload
    try {
      const query: string =
        "INSERT INTO comments (id, parent_comment_id, post_id, user_id, comment, level, images, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"
      const response = await postgresqlConnection.query(query, [
        id,
        parentCommentId,
        postId,
        userId,
        content,
        level,
        images,
        status,
      ])

      return response?.rowCount === 1
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public addReport = async (
    id: string,
    commentId: string,
    userId: string,
    reason: string,
  ): Promise<boolean | undefined> => {
    try {
      const query =
        "insert into reported_comments (id, comment_id, user_id, reason) values ($1, $2, $3, $4)"
      const response = await postgresqlConnection.query(query, [
        id,
        commentId,
        userId,
        reason,
      ])

      return response?.rowCount === 1
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public edit = async (
    id: string,
    comment: string,
    status: string,
    images?: string[] | undefined,
  ): Promise<boolean | undefined> => {
    try {
      const query =
        "UPDATE comments SET comment = $1, images = $2, status = $3 WHERE id = $4 RETURNING *"
      const response = await postgresqlConnection.query(query, [
        comment,
        images,
        status,
        id,
      ])

      return response?.rowCount === 1
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public adminDelete = async (id: string): Promise<boolean | undefined> => {
    try {
      const query = "DELETE FROM comments WHERE id = $1"
      const response = await postgresqlConnection.query(query, [id])

      return response?.rowCount === 1
    } catch (error: unknown) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public delete = async (
    id: string,
    status: string,
  ): Promise<boolean | undefined> => {
    try {
      const query = "UPDATE comments SET status = $2 WHERE id = $1"
      const response = await postgresqlConnection.query(query, [id, status])

      return response?.rowCount === 1
    } catch (error: unknown) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public isResolved = async (id: string): Promise<boolean | undefined> => {
    try {
      const query = "select resolved_at from reported_comments where id = $1"
      const response = await postgresqlConnection.query(query, [id])

      return response?.rowCount === 1
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public resolveReport = async (id: string): Promise<boolean | undefined> => {
    try {
      const query = "update reported_comments set resolved_at = NOW() where id = $1 and resolved_at IS NULL"
      const response = await postgresqlConnection.query(query, [id])

      return response?.rowCount === 1
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public commentLevel = async (id: string): Promise<number> => {
    try {
      const query = "SELECT level FROM comments WHERE id = $1"
      const response = await postgresqlConnection.query(query, [id])
      const result = response.rows[0]

      if (typeof result.level === "number") return +result.level
      throw new Error("Internal server error")
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public hasCommentExisted = async (
    id: string,
  ): Promise<boolean | undefined> => {
    try {
      const query = "SELECT 1 FROM comments WHERE id = $1"
      const response = await postgresqlConnection.query(query, [id])

      if (response?.rowCount === 1) {
        return true
      }

      return false
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public isSameUser = async (
    userId: string,
    id: string,
  ): Promise<boolean | undefined> => {
    try {
      const query = "SELECT 1 FROM comments WHERE id = $1 AND user_id = $2"
      const response = await postgresqlConnection.query(query, [id, userId])

      return response?.rowCount === 1
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public findAllReports = async (): Promise<Comment[] | undefined> => {
    try {
      const query = "select * from reported_comments"
      const response = await postgresqlConnection.query(query)

      return (response?.rows[0] as Comment[]) ?? undefined
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }
}
