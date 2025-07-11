import jwt, { type JwtPayload } from "jsonwebtoken"
import argon2 from "argon2"

import { generateUserId } from "~/miscs/helpers/generateIds"
import { ROLE } from "~/miscs/others/roles.interface"
import EnvConfig from "~/configs/env.config"
import UserRepository from "../user/user.repository"

import type { LoginDTO, RegisterDTO, TokensDTO } from "./auth.dto"
import type { Logger } from "~/miscs/logger"
import type { BaseResponse } from "~/miscs/others"
import type AuthRepository from "./auth.repository"
import type { UserModel } from "../user/user.model"
import type JwtService from "~/@core/services/jwt"
import { HTTP_STATUS } from "~/miscs/utils"
import type AuthResponse from "./auth.response"

interface RefreshTokenPayload extends JwtPayload {
  userId: string
  tokenId: string // Mostly for consistency with the jwt middleware, should be fine if you want to remove it.
}

export default class AuthService {
  private readonly _userRepository: UserRepository

  constructor(
    private readonly _jwtService: JwtService,
    private readonly _authRepository: AuthRepository,
    private readonly _logger: Logger,
  ) {
    this._userRepository = new UserRepository()
  }

  public register = async (
    payload: RegisterDTO,
  ): Promise<BaseResponse | undefined> => {
    const { username, email, password } = payload

    try {
      const isExisted = await this._userRepository.hasExisted(email)
      if (isExisted === true) {
        return {
          error: true,
          statusCode: 400,
          message: "This email has been registered.",
        }
      }

      const hashedPassword: string = await argon2.hash(password)
      const userId = generateUserId()
      const role: string = ROLE.USER

      const response: boolean | undefined = await this._authRepository.register(
        userId,
        username,
        email,
        hashedPassword,
        role,
      )
      if (!response) {
        return {
          statusCode: 500,
          message: "Cannot create user",
        }
      }
      return {
        statusCode: 201,
        message: "User registered successfully",
      }
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public login = async (
    payload: LoginDTO,
  ): Promise<AuthResponse | undefined> => {
    try {
      const { password } = payload
      // Only allows either username or password to login, but not both.
      const identifier: string | undefined =
        "username" in payload ? payload.username : payload.email

      if (!identifier || !password) {
        return {
          error: true,
          statusCode: HTTP_STATUS.BAD_REQUEST.code,
          message: "Please enter username/email and password!",
        }
      }

      const user = await this._authRepository.login(identifier)
      if (!user) {
        return {
          error: true,
          statusCode: HTTP_STATUS.UNAUTHORIZED.code,
          message: "Invalid username or password",
        }
      }

      const isPasswordMatch: boolean | undefined = await argon2.verify(
        user.password,
        password,
      )

      if (!isPasswordMatch) {
        return {
          error: true,
          statusCode: HTTP_STATUS.UNAUTHORIZED.code,
          message: "Invalid username or password.",
        }
      }

      // Generates access and refresh token
      const { id, email, role } = user
      const tokens = await this._generateTokens(id, email, role)

      if (!tokens)
        return {
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
        }

      // Adds to the DB.
      const { accessToken, refreshToken, refreshTokenId } = tokens
      await this._updateRefreshToken(id, refreshToken, refreshTokenId)

      return {
        statusCode: HTTP_STATUS.OK.code,
        message: HTTP_STATUS.OK.message,
        accessToken: accessToken,
        refreshToken: refreshToken,
      }
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
        return {
          error: true,
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
        }
      }

      throw error
    }
  }

  /**
   * Generates access and refresh tokens.
   * @param {string} userId
   * @param {string} email
   * @param {string} role
   * @returns {Promise<TokensDTO | undefined>} Returns access and refresh tokens.
   */
  private readonly _generateTokens = async (
    userId: string,
    email: string,
    role: string,
  ): Promise<TokensDTO | undefined> => {
    try {
      const accessToken: string = this._jwtService.generateAccessToken(
        userId,
        email,
        role,
      )

      const refreshToken = this._jwtService.generateRefreshToken(userId, email)
      if (!accessToken && !refreshToken) {
        throw new Error(HTTP_STATUS.INTERNAL_SERVER_ERROR.message)
      }

      const { token, tokenId } = refreshToken

      return {
        accessToken: accessToken,
        refreshToken: token,
        refreshTokenId: tokenId,
      }
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  private readonly _updateRefreshToken = async (
    userId: string,
    token: string,
    tokenId: string,
  ): Promise<void> => {
    try {
      const oldRefreshToken =
        await this._authRepository.hasUserRefreshTokenExists(userId)

      if (!oldRefreshToken) {
        const addRefreshToken = await this._authRepository.addRefreshToken(
          userId,
          token,
          tokenId,
        )

        if (!addRefreshToken)
          throw new Error(HTTP_STATUS.INTERNAL_SERVER_ERROR.message)
      } else {
        const updateRefreshToken =
          await this._authRepository.updateRefreshToken(userId, token, tokenId)

        if (!updateRefreshToken)
          throw new Error(HTTP_STATUS.INTERNAL_SERVER_ERROR.message)
      }
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public refreshAccessToken = async (
    refreshToken: string,
  ): Promise<AuthResponse | undefined> => {
    try {
      const decode = jwt.verify(
        refreshToken,
        EnvConfig.app.jwtAccessSecret as jwt.Secret,
      ) as RefreshTokenPayload

      const user: UserModel | undefined =
        await this._authRepository.findUserRefreshToken(
          decode?.userId,
          refreshToken,
        )

      if (!user) {
        return {
          statusCode: HTTP_STATUS.UNAUTHORIZED.code,
          message: HTTP_STATUS.UNAUTHORIZED.message,
        }
      }

      const newAccessToken: string = this._jwtService.generateAccessToken(
        user.id,
        user.email,
        user.role,
      )

      return {
        statusCode: HTTP_STATUS.CREATED.code,
        message: HTTP_STATUS.CREATED.message,
        accessToken: newAccessToken,
      }
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
        return {
          error: true,
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
        }
      }

      throw error
    }
  }

  public logout = async (token: string): Promise<AuthResponse | undefined> => {
    try {
      const secretKey: string | undefined = EnvConfig.app.jwtRefreshSecret
      if (!secretKey) {
        return {
          error: true,
          statusCode: HTTP_STATUS.BAD_REQUEST.code,
          message: "No refresh token found",
        }
      }

      const secret = Buffer.from(secretKey, "base64")
      const decode = jwt.verify(token, secret as jwt.Secret, {
        algorithms: ["HS512"],
      }) as RefreshTokenPayload

      const isLoggedOut: number | undefined =
        await this._authRepository.logout(decode?.userId)

      if (!isLoggedOut) {
        return {
          error: true,
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
        }
      }
      else if (isLoggedOut === 0) {
        return {
          statusCode: HTTP_STATUS.NO_CONTENT.code,
          message: HTTP_STATUS.NO_CONTENT.message,
        }
      }

      return {
        statusCode: HTTP_STATUS.OK.code,
        message: HTTP_STATUS.OK.message,
      }
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
        return {
          error: true,
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
        }
      }

      throw error
    }
  }
}
