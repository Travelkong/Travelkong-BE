import type { Request, Response, NextFunction } from "express"

import { HTTP_STATUS } from "~/miscs/utils"
import type { LoginDTO, RegisterDTO } from "./auth.dto"
import type AuthValidator from "./auth.validator"
import type AuthService from "./auth.service"

export default class AuthController {
  constructor(
    private readonly _authValidator: AuthValidator,
    private readonly _authService: AuthService,
  ) {}

  public register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const payload: RegisterDTO = req.body
      if (!payload) {
        return res.status(400).json({
          message: "The username, email, and password must not be blank.",
        })
      }

      const validationError = this._authValidator.register(payload)
      if (validationError) {
        return res.status(400).json({ message: validationError })
      }

      const response = await this._authService.register(payload)
      if (response) {
        return res
          .status(response?.statusCode)
          .json({ message: response?.message })
      }
    } catch (error: unknown) {
      next(error)
    }
  }

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const payload: LoginDTO = req.body
      if (!payload) {
        return res.status(400).json({
          message: "The username, email, and password must not be blank.",
        })
      }

      const validationError = this._authValidator.login(payload)
      if (validationError) {
        return res.status(400).json({ message: validationError })
      }

      const response = await this._authService.login(payload)
      if (!response) {
        return res
          .status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code)
          .json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message })
      }

      if ("refresh_token" in response) {
        res.cookie("refreshToken", response.refresh_token, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })

        delete response.refresh_token
      }

      return res
        .status(response?.statusCode)
        .json({ message: response?.message, token: response?.data })
    } catch (error: unknown) {
      next(error)
    }
  }

  public refreshAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const cookie: string | undefined = req.cookies?.refreshToken
      if (!cookie)
        return res
          .status(HTTP_STATUS.UNAUTHORIZED.code)
          .json({ message: HTTP_STATUS.UNAUTHORIZED.message })

      const response = await this._authService.refreshAccessToken(cookie)

      if (response) {
        return res.status(response?.statusCode).json(response)
      }
    } catch (error: unknown) {
      next(error)
    }
  }

  public logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const cookie = req.cookies

      return
    } catch (error: unknown) {
      next(error)
    }
  }
}
