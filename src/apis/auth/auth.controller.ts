import type { Request, Response, NextFunction } from "express"

import { Logger } from "~/miscs/logger"
import type { LoginDTO, RegisterDTO } from "./auth.dto"
import AuthValidator from "./auth.validator"
import AuthService from "./auth.service"

const logger = new Logger()

class AuthController {
  readonly #authValidator: AuthValidator
  readonly #authService: AuthService

  constructor() {
    this.#authValidator = new AuthValidator()
    this.#authService = new AuthService()
  }

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

      const validationError = this.#authValidator.register(payload)
      if (validationError) {
        return res.status(400).json({ message: validationError })
      }

      const response = await this.#authService.register(payload)
      if (response) {
        res.status(response?.statusCode).json({ message: response?.message })
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

      const validationError = this.#authValidator.login(payload)
      if (validationError) {
        res.status(400).json({ message: validationError })
        return
      }

      const response = await this.#authService.login(payload)
      if (response) {
        res.status(response?.statusCode).json({ message: response?.message })
      }
    } catch (error: unknown) {
      next(error)
    }
  }
}

export default new AuthController()
