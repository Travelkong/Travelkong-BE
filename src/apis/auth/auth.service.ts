import jwt, { type JwtPayload } from "jsonwebtoken"
import argon2 from "argon2"

import { generateUserId } from "~/miscs/helpers/generateIds"
import { ROLE } from "~/miscs/others/roles.interface"
import EnvConfig from "~/configs/env.config"
import UserRepository from "../user/user.repository"

import type { LoginDTO, RegisterDTO } from "./auth.dto"
import type { Logger } from "~/miscs/logger"
import type { BaseResponse } from "~/miscs/others"
import type AuthRepository from "./auth.repository"
import type { UserModel } from "../user/user.model"
import type JwtService from "~/@core/services/jwt"
import { HTTP_STATUS } from "~/miscs/utils"

interface RefreshTokenPayload extends JwtPayload {
  userId: string
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
  ): Promise<BaseResponse | undefined> => {
    try {
      const { password } = payload
      // Only allows either username or password to login, but not both.
      const identifier: string | undefined =
        "username" in payload ? payload.username : payload.email

      if (!identifier || !password) {
        return {
          error: true,
          statusCode: 400,
          message: "Please enter username/email and password!",
        }
      }

      const user = await this._authRepository.login(identifier)
      if (!user) {
        return {
          error: true,
          statusCode: 401,
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
          statusCode: 401,
          message: "Invalid username or password.",
        }
      }

      // Generates access and refresh token
      const tokens = await this._generateTokens(user.id, user.email, user.role)

      return {
        statusCode: HTTP_STATUS.OK.code,
        message: HTTP_STATUS.OK.message,
        data: {
          accessToken: tokens?.accessToken,
          refreshToken: tokens?.refreshToken,
        },
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
   * @param {string} id
   * @param {string} email
   * @param {string} role
   * @returns {Promise<{ accessToken: string; refreshToken: string } | undefined>} Returns access and refresh tokens.
   */
  private readonly _generateTokens = async (
    id: string,
    email: string,
    role: string,
  ): Promise<{ accessToken: string; refreshToken: string } | undefined> => {
    try {
      const accessToken: string = this._jwtService.generateAccessToken(
        id,
        email,
        role,
      )

      const newRefreshToken = this._jwtService.generateRefreshToken(id, email)

      const updateRefreshToken = await this._authRepository.updateRefreshToken(
        id,
        newRefreshToken.tokenId,
      )

      if (!updateRefreshToken)
        throw new Error(HTTP_STATUS.INTERNAL_SERVER_ERROR.message)

      return { accessToken: accessToken, refreshToken: newRefreshToken.token }
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public refreshAccessToken = async (
    refreshToken: string,
  ): Promise<BaseResponse | undefined> => {
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
          statusCode: HTTP_STATUS.NO_CONTENT.code,
          message: HTTP_STATUS.NO_CONTENT.message,
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
        data: newAccessToken,
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
