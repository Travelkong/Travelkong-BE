import { Logger } from "~/miscs/logger"
import type { UserResponse } from "./user.response"
import type { UserModel } from "./user.model"
import UserRepository from "./user.repository"
import type { UpdateUserDTO } from "./user.dto"

interface IUserService {
  findUser(userId: string): Promise<UserResponse | undefined>
}

export default class UserService implements IUserService {
  readonly #logger: Logger
  readonly #userRepository: UserRepository

  constructor() {
    this.#logger = new Logger()
    this.#userRepository = new UserRepository()
  }

  public findUser = async (
    userId: string,
  ): Promise<UserResponse | undefined> => {
    try {
      const currentUser: UserModel | undefined =
        await this.#userRepository.findUser(userId)
      if (currentUser) {
        return {
          message: "Success",
          statusCode: 200,
          response: currentUser,
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
        throw error
      }
    }
  }

  public getAll = async (): Promise<UserResponse | undefined> => {
    try {
      const response = await this.#userRepository.getAll()
      if (response) {
        return {
          message: "Success",
          statusCode: 200,
          response: response,
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
        throw error
      }
    }
  }

  public update = async (
    payload: UpdateUserDTO,
  ): Promise<UserResponse | undefined> => {
    try {
      const response = await this.#userRepository.update(payload)
      if (response) {
        return {
          message: "Success",
          statusCode: 200,
          response: response,
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
        throw error
      }
    }
  }

  public delete = async (id: string): Promise<UserResponse | undefined> => {
    try {
      const isExisted = await this.#userRepository.isUserExisted(id)
      if (isExisted === false) {
        return {
          statusCode: 204,
          message: "No user found."
        }
      }

      const response = await this.#userRepository.delete(id)
      if (response) {
        return {
          statusCode: 200,
          message: "Success",
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
        throw error
      }
    }
  }
}
