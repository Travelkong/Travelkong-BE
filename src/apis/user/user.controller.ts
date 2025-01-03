import type { Response, NextFunction } from "express"

import type { AuthenticatedRequest } from "~/middlewares"
import UserService from "./user.service"

class UserController {
  readonly #userService: UserService

  constructor() {
    this.#userService = new UserService()
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
}

export default new UserController()
