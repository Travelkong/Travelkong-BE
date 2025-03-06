import argon2 from "argon2"

import { generateAccessToken } from "~/middlewares"
import { generateUserId } from "~/miscs/helpers/generateIds"
import type { LoginDTO, RegisterDTO } from "./auth.dto"
import { ROLE } from "~/miscs/others/roles.interface"
import { Logger } from "~/miscs/logger"
import type { BaseResponse } from "~/miscs/others"
import AuthRepository from "./auth.repository"
import UserRepository from "../user/user.repository"

require("dotenv").config()

export default class AuthService {
  readonly #authRepository: AuthRepository
  readonly #userRepository: UserRepository
  readonly #logger: Logger

  constructor() {
    this.#authRepository = new AuthRepository()
    this.#userRepository = new UserRepository()
    this.#logger = new Logger()
  }

  public register = async (
    payload: RegisterDTO,
  ): Promise<BaseResponse | undefined> => {
    const { username, email, password } = payload

    try {
      const isExisted = await this.#userRepository.hasExisted(email)
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

      const response: boolean | undefined = await this.#authRepository.register(
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public login = async (
    payload: LoginDTO,
  ): Promise<BaseResponse | undefined> => {
    try {
      const { password } = payload
      // Only use either username or password to login.
      const identifier: string | undefined =
        "username" in payload ? payload.username : payload.email

      if (!identifier || !password) {
        return {
          error: true,
          statusCode: 400,
          message: "Please enter username/email and password!",
        }
      }

      const user = await this.#authRepository.login(identifier)
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

      // Generates JWT
      const token: string = generateAccessToken(user.id)
      return {
        statusCode: 200,
        message: "Login successfully",
        data: token,
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
        return {
          error: true,
          statusCode: 500,
          message: "Internal server error.",
        }
      }

      throw error
    }
  }
}
