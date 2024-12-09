import { Response, NextFunction } from "express"

import { AuthenticatedRequest } from "~/middlewares"
import { UserModel } from "./user.model"
import UserService from "./user.service"

class UserController {
  readonly #userService: UserService

  constructor() {
    this.#userService = new UserService()
  }

  public getCurrentUser = async (
    req: AuthenticatedRequest & { body: UserModel },
    res: Response,
    next: NextFunction,
  ): Promise<Response<any, Record<string, any>> | undefined> => {
    try {
      const userId: string = req.user?.userId
      const response = await this.#userService.findUser(userId)
      return res.status(response.statusCode).json({ message: response })
    } catch (error: any) {
      next(error)
    }
  }
}

export default new UserController()
