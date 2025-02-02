import type { Response, NextFunction } from "express"

import { isAdmin, type AuthenticatedRequest } from "~/middlewares"
import UserService from "./user.service"
import type { UpdateUserDTO } from "./user.dto"
import UserValidator from "./user.validator"

class UserController {
  readonly #userService: UserService
  readonly #userValidator: UserValidator

  constructor() {
    this.#userService = new UserService()
    this.#userValidator = new UserValidator()
  }

  public getCurrentUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const userId: string | undefined = req.user?.userId
      if (!userId) {
        return res.status(401).json({ message: "No user ID provided." })
      }

      const response = await this.#userService.findUser(userId)
      if (response) {
        return res.status(response.statusCode).json({ message: response })
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error)
      }
    }
  }

  public getAll = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const userId: string | undefined = req.user?.userId
      if (!userId) {
        return res.status(401).json({ message: "No user ID provided." })
      }

      const checksAdmin: boolean | undefined = await isAdmin(userId)
      if (!checksAdmin) {
        return res
          .status(403)
          .json({ message: "You are not authorized for this action." })
      }

      const response = await this.#userService.getAll()
      if (response) {
        return res
          .status(response?.statusCode)
          .json({ response: response?.response })
      }
    } catch (error: unknown) {
      next(error)
    }
  }

  public update = async (
    req: AuthenticatedRequest & { body: UpdateUserDTO },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const userId: string | undefined = req.user?.userId
      if (!userId) {
        return res.status(401).json({ message: "No user ID provided." })
      }

      const payload = req.body
      if (!payload) {
        return res.status(400).json({ message: "Invalid input." })
      }

      const validationError = this.#userValidator.update(payload)
      if (validationError) {
        return res.status(400).json({ message: validationError })
      }

      const response = await this.#userService.update(userId, payload)
      if (response) {
        return res
          .status(response?.statusCode)
          .json({ response: response?.message })
      }
    } catch (error: unknown) {
      next(error)
    }
  }

  public delete = async (
    req: AuthenticatedRequest & { body: string },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const userId: string | undefined = req.user?.userId
      if (!userId) {
        return res.status(401).json({ message: "No user ID provided." })
      }

      const checksAdmin = await isAdmin(userId)
      if (!checksAdmin) {
        return res
          .status(403)
          .json({ message: "You are not authorized for this action." })
      }

      const id = req.body
      if (!id) {
        return res.status(400).json({ message: "Invalid input." })
      }

      const validationError = await this.#userValidator.validateId(id)
      if (validationError) {
        return res.status(400).json({ message: validationError })
      }

      const response = await this.#userService.delete(id)
      if (response) {
        return res.status(response?.statusCode).json({ message: response?.message })
      }
    } catch (error: unknown) {
      next(error)
    }
  }
}

export default new UserController()
