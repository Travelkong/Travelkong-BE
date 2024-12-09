import { Logger } from "~/miscs/logger"
import { UserResponse } from "./user.response"
import { UserModel } from "./user.model"
import UserRepository from "./user.repository"

interface IUserService {
  findUser(userId: string): Promise<UserResponse>
}

export default class UserService implements IUserService {
  readonly #logger: Logger
  readonly #userRepository: UserRepository

  constructor() {
    this.#logger = new Logger()
    this.#userRepository = new UserRepository()
  }

  public findUser = async (userId: string): Promise<UserResponse> => {
    try {
        const currentUser: UserModel = await this.#userRepository.findUser(userId)
        return {
            message: "Success",
            statusCode: 200,
            response: currentUser
        }
    } catch (error: any) {
        this.#logger.error(error)
        throw error
    }
  }
}
