import postgresqlConnection from "~/configs/postgresql.config"

import type { UserModel } from "../user/user.model"
import type { Logger } from "~/miscs/logger"

export default class AuthRepository {
  constructor(private readonly _logger: Logger) {}

  public register = async (
    userId: string,
    username: string,
    email: string,
    password: string,
    role: string,
  ): Promise<boolean | undefined> => {
    try {
      const query: string =
        "INSERT INTO users (id, username, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING username, email"
      const response = await postgresqlConnection.query(query, [
        userId,
        username,
        email,
        password,
        role,
      ])

      return response?.rowCount === 1
    } catch (error: unknown) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public login = async (identifier: string): Promise<UserModel | undefined> => {
    try {
      const query =
        "SELECT * FROM users WHERE (username = $1 OR email = $1) LIMIT 1"
      const response = await postgresqlConnection.query(query, [identifier])

      return response.rows[0] as UserModel
    } catch (error: unknown) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public hasUserRefreshTokenExists = async (
    userId: string,
  ): Promise<boolean | undefined> => {
    try {
      const query = "SELECT is_user_refresh_token_exists($1) AS is_existed"
      const response = await postgresqlConnection.query(query, [userId])
      return response?.rows[0]?.is_existed === true
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public addRefreshToken = async (
    userId: string,
    token: string,
    tokenId: string,
  ): Promise<boolean | undefined> => {
    try {
      const query = "SELECT add_refresh_token($1, $2, $3)"
      const response = await postgresqlConnection.query(query, [tokenId, userId, token])
      return response?.rowCount === 1
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public updateRefreshToken = async (
    userId: string,
    token: string,
    tokenId: string,
  ): Promise<boolean | undefined> => {
    try {
      const query = "SELECT update_refresh_token($1, $2, $3)"
      const response = await postgresqlConnection.query(query, [
        tokenId,
        userId,
        token,
      ])

      return response?.rowCount === 1
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public findUserRefreshToken = async (
    userId: string,
    refreshToken: string,
  ): Promise<UserModel | undefined> => {
    try {
      const query = ""
      const response = await postgresqlConnection.query(query, [
        userId,
        refreshToken,
      ])

      return
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public logout = async () => {}
}
